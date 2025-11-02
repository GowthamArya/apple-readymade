import Razorpay from "razorpay";

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
    const { amount, currency = "INR", receipt, notes } = (await req.json()) as {
      amount: number;
      currency?: string;
      receipt?: string;
      notes?: Record<string, string>;
    };

    if (!Number.isFinite(amount) || amount <= 0) {
      return Response.json({ error: "Invalid amount" }, { status: 400 });
    }

    const razorpay = getRazorpay();

    const order = await razorpay.orders.create({
      amount,            // paise (e.g., 129900 = ₹1299.00)
      currency,          // "INR"
      receipt: receipt ?? `rcpt_${Date.now()}`,
      notes: notes ?? {},
    });

    return Response.json({ orderId: order.id }, { status: 200 });
  } catch (e: any) {
    return Response.json({ error: e.message || "Order creation failed" }, { status: 500 });
  }
}
