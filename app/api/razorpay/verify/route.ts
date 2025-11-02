// app/api/razorpay/verify/route.ts
import crypto from "crypto";

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

    // TODO: If verified, persist order status in DB (paid),
    // save gateway refs (payment_id, order_id), and trigger fulfillment emails.

    return Response.json({ verified }, { status: 200 });
  } catch (e: any) {
    return Response.json({ verified: false, error: e.message || "Verification failed" }, { status: 500 });
  }
}
