import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error("Razorpay env vars missing: set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET");
  }
  return new Razorpay({ key_id, key_secret });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch (err) {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { amount, currency = "INR", receipt, notes, items, shippingAddress, address_id, pointsRedeemed = 0 } = body as {
      amount: number;
      currency?: string;
      receipt?: string;
      notes?: Record<string, string>;
      items: any[];
      shippingAddress: any;
      address_id?: number | null;
      pointsRedeemed?: number;
    };

    if (!Number.isFinite(amount) || amount < 0) {
      return Response.json({ error: "Invalid amount" }, { status: 400 });
    }

    let finalAmount = amount; // paise
    let pointsAmount = 0; // rupees

    // Validate Stock
    if (items && items.length > 0) {
      const variantIds = items.map((item: any) => item.id || item.variant?.id);
      const { data: variants, error: variantsError } = await supabase
        .from('variant')
        .select('id, stock, sku')
        .in('id', variantIds);

      if (variantsError) {
        console.error("Error fetching variants for stock check:", variantsError);
        return Response.json({ error: "Failed to verify stock" }, { status: 500 });
      }

      for (const item of items) {
        const variantId = item.id || item.variant?.id;
        const requestedQty = item.quantity || 1;
        const variant = variants?.find(v => v.id === variantId);

        if (!variant) {
          return Response.json({ error: `Product variant not found` }, { status: 400 });
        }
        if (variant.stock < requestedQty) {
          return Response.json({ error: `Out of stock: ${variant.sku || 'Item'} (Requested: ${requestedQty}, Available: ${variant.stock})` }, { status: 400 });
        }
      }
    }

    // Validate Points
    if (pointsRedeemed > 0) {
      const { data: userPoints, error: pointsError } = await supabase
        .rpc('get_user_points', { user_uuid: session?.user.id });

      if (pointsError) {
        console.error("Error fetching user points:", pointsError);
        return Response.json({ error: "Failed to fetch user points" }, { status: 500 });
      }

      if (userPoints < pointsRedeemed) {
        return Response.json({ error: "Insufficient points" }, { status: 400 });
      }

      // 1 Point = 1 INR
      pointsAmount = pointsRedeemed;
      const discountPaise = pointsAmount * 100;
      finalAmount = Math.max(0, amount - discountPaise);
    }

    // Strict Shipment Serviceability Check
    try {
      if (!shippingAddress || !shippingAddress.pincode) {
        throw new Error("Pincode is required for shipping serviceability check.");
      }
      const { getShiprocketPincodeDetails } = await import("@/lib/shiprocket");
      await getShiprocketPincodeDetails(shippingAddress.pincode);
    } catch (err: any) {
      return Response.json({
        error: `Shipment unavailable for this location: ${err.message}`,
        shipment_error: true
      }, { status: 400 });
    }

    // 1. Create Order in DB (Pending)
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: session?.user.id,
        total_amount: amount / 100, // Original total before discount
        status: 'pending',
        address_id: address_id || null,
        shipping_address: shippingAddress,
        points_redeemed: pointsRedeemed,
        points_amount: pointsAmount
      })
      .select()
      .single();

    if (orderError || !orderData) {
      console.error("DB Order Creation Failed:", orderError);
      return Response.json({ error: "Failed to create order in database" }, { status: 500 });
    }

    // 2. Insert Order Items
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        order_id: orderData.id,
        product_id: item.product_id || item.product?.id, // Handle different structures
        variant_id: item.id, // Assuming item.id is variant id from cart
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error("DB Order Items Creation Failed:", itemsError);
        // Ideally rollback order here
        return Response.json({ error: "Failed to create order items" }, { status: 500 });
      }
    }

    // 3. Create Razorpay Order
    // If finalAmount is 0 (fully paid by points), skip Razorpay or handle differently?
    // Razorpay requires amount > 0 (usually > 1 INR).
    // If fully paid by points, we should just return success and mark as paid.

    let razorpayOrderId = null;

    if (finalAmount > 0) {
      const razorpay = getRazorpay();
      const order = await razorpay.orders.create({
        amount: finalAmount,            // paise
        currency,          // "INR"
        receipt: receipt ?? `rcpt_${Date.now()}`,
        notes: { ...notes, db_order_id: orderData.id }, // Store DB Order ID in notes
      });
      razorpayOrderId = order.id;

      // 4. Update DB Order with Razorpay Order ID
      await supabase
        .from('orders')
        .update({ razorpay_order_id: razorpayOrderId })
        .eq('id', orderData.id);
    } else {
      await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderData.id);

      await supabase
        .from('loyalty_points')
        .insert({
          user_id: session?.user.id,
          points: -pointsRedeemed,
          transaction_type: 'redeem',
          order_id: orderData.id.toString(),
          amount: pointsAmount
        });
    }

    return Response.json({ orderId: razorpayOrderId, dbOrderId: orderData.id, amountDue: finalAmount }, { status: 200 });
  } catch (e: any) {
    console.error("Order Route Error:", e);
    return Response.json({ error: e.message || "Order creation failed" }, { status: 500 });
  }
}
