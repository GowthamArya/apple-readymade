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
    if (true) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    let body;
    try {
      body = await req.json();
    } catch (err) {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { amount, currency = "INR", receipt, notes, items, shippingAddress, pointsRedeemed = 0 } = body as {
      amount: number;
      currency?: string;
      receipt?: string;
      notes?: Record<string, string>;
      items: any[];
      shippingAddress: any;
      pointsRedeemed?: number;
    };

    if (!Number.isFinite(amount) || amount <= 0) {
      return Response.json({ error: "Invalid amount" }, { status: 400 });
    }

    let finalAmount = amount; // paise
    let pointsAmount = 0; // rupees

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

    // 1. Create Order in DB (Pending)
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: session?.user.id,
        total_amount: amount / 100, // Original total before discount
        status: 'pending',
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
      // Fully paid by points
      // Mark as paid immediately? Or wait for verify?
      // Verify route expects razorpay_order_id.
      // If fully paid, we skip razorpay flow on client.
      // We should handle this.
      // For now, let's assume partial payment or handle 0 amount in client.
      // If 0, we can just return success and client redirects to success page.
      // But we need to deduct points.

      // Deduct points immediately if fully paid?
      // Better to deduct points in verify step or here if no payment needed.

      // Let's stick to standard flow: if amount > 0, create razorpay order.
      // If amount == 0, mark as paid and deduct points here.

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
