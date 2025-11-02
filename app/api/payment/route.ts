// app/api/razorpay/order/route.ts
import Razorpay from "razorpay";

export const runtime = "nodejs";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      amount: number; // in paise, e.g., 129900 = ₹1299.00
      currency?: string; // default "INR"
      receipt?: string;
      notes?: Record<string, string>;
    };

    const order = await razorpay.orders.create({
      amount: body.amount,
      currency: body.currency ?? "INR",
      receipt: body.receipt ?? `rcpt_${Date.now()}`,
      notes: body.notes ?? {},
    });

    return Response.json({ orderId: order.id }, { status: 200 });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
