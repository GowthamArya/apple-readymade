// app/api/razorpay/verify/route.ts
import crypto from "crypto";
import { supabase } from "@/lib/supabaseServer";

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
      }
    }

    return Response.json({ verified }, { status: 200 });
  } catch (e: any) {
    console.error("Verify Route Error:", e);
    return Response.json({ verified: false, error: e.message || "Verification failed" }, { status: 500 });
  }
}
