// app/api/razorpay/verify/route.ts
import crypto from "crypto";
import { supabase } from "@/lib/supabaseServer";
import { createShiprocketOrder } from "@/lib/shiprocket";
import { sendOrderNotificationToAdmin } from "@/lib/emailService";

export const runtime = "nodejs";          // use Node runtime for crypto

type VerifyBody = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

export async function POST(req: Request) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      (await req.json()) as VerifyBody;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return Response.json({ verified: false, error: "Missing fields" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return Response.json({ verified: false, error: "Missing RAZORPAY_KEY_SECRET" }, { status: 500 });
    }

    // Build the string: order_id|payment_id
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    // Compute HMAC SHA256 with your secret
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    const verified = expectedSignature === razorpay_signature;

    if (verified) {
      // 1. Update Order Status to Paid
      const { data: orderData, error: updateError } = await supabase
        .from('orders')
        .update({ status: 'paid', razorpay_payment_id })
        .eq('razorpay_order_id', razorpay_order_id)
        .select()
        .single();

      if (updateError || !orderData) {
        console.error("Failed to update order status:", updateError);
        // Even if DB update fails, payment is verified. We might need manual reconciliation.
      } else {
        // 2. Deduct Redeemed Points
        if (orderData.points_redeemed > 0) {
          const { error: redeemError } = await supabase
            .from('loyalty_points')
            .insert({
              user_id: orderData.user_id,
              points: -orderData.points_redeemed,
              transaction_type: 'redeem',
              order_id: orderData.id.toString(),
              amount: orderData.points_amount
            });

          if (redeemError) console.error("Failed to deduct points:", redeemError);
        }

        // 3. Award Loyalty Points (1 Point = 1 INR)
        // Earn on money spent (Total - Points Discount)
        const moneySpent = Math.max(0, orderData.total_amount - (orderData.points_amount || 0));
        const pointsEarned = Math.floor(moneySpent * 0.01);

        if (pointsEarned > 0) {
          const { error: pointsError } = await supabase
            .from('loyalty_points')
            .insert({
              user_id: orderData.user_id,
              points: pointsEarned,
              transaction_type: 'earn',
              order_id: orderData.id.toString(),
              amount: moneySpent
            });

          if (pointsError) {
            console.error("Failed to award points:", pointsError);
          }
        }

        // 4. Create Shiprocket Shipment
        try {
          const { data: orderItems, error: itemsError } = await supabase
            .from('order_items')
            .select('*, variant:variant_id(*, product:product_id(name))')
            .eq('order_id', orderData.id);

          if (itemsError) throw itemsError;

          const shiprocketOrder = await createShiprocketOrder({
            order_id: orderData.id.toString(),
            order_date: new Date().toISOString().split('T')[0],
            pickup_location: "Home",
            billing_customer_name: orderData.shipping_address.name.split(' ')[0],
            billing_last_name: orderData.shipping_address.name.split(' ').slice(1).join(' ') || '.',
            billing_address: orderData.shipping_address.address || "N/A",
            billing_city: orderData.shipping_address.city || "N/A",
            billing_pincode: orderData.shipping_address.pincode || "000000",
            billing_state: orderData.shipping_address.state || "N/A",
            billing_country: "India",
            billing_email: orderData.shipping_address.email || "customer@example.com",
            billing_phone: orderData.shipping_address.contact,
            shipping_is_billing: true,
            order_items: orderItems.map((it: any) => ({
              name: it.variant?.product?.name || "Product",
              sku: it.variant_id.toString(),
              units: it.quantity,
              selling_price: it.price,
            })),
            payment_method: "Prepaid",
            sub_total: orderData.total_amount,
            length: 20,
            width: 20,
            height: orderItems.length * 5,
            breadth: orderItems.length * 5,
            weight: (orderItems.length * 1),
          });

          // Update order with Shiprocket IDs if columns exist
          await supabase.from('orders').update({
            shiprocket_order_id: shiprocketOrder.order_id,
            shiprocket_shipment_id: shiprocketOrder.shipment_id,
            status: 'paid' // Or a specific status like 'ready_to_ship'
          }).eq('id', orderData.id);

          console.log("Shiprocket order created:", shiprocketOrder.order_id);

          // Send Admin Notification
          await sendOrderNotificationToAdmin(orderData, orderItems);

          return Response.json({ verified: true, shiprocket_order_id: shiprocketOrder.order_id }, { status: 200 });
        } catch (srError: any) {
          console.error("Shiprocket integration failed:", srError);
          return Response.json({
            verified: true,
            shiprocket_error: srError.message || "Shiprocket order creation failed. Our team will process it manually."
          }, { status: 200 });
        }
      }
    }

    return Response.json({ verified }, { status: 200 });
  } catch (e: any) {
    console.error("Verify Route Error:", e);
    return Response.json({ verified: false, error: e.message || "Verification failed" }, { status: 500 });
  }
}
