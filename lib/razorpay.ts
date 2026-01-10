import Razorpay from "razorpay";

export function getRazorpay() {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
        throw new Error("Razorpay env vars missing");
    }
    return new Razorpay({ key_id, key_secret });
}

export async function processRefund(paymentId: string, amount: number, notes?: object) {
    try {
        const razorpay = getRazorpay();
        // Refund amount is valid in paise
        // amount passed in should be in rupees, so we multiply by 100
        // unless it's already handled by caller. Let's assume input is in Rupees for clarity.
        const amountInPaise = Math.round(amount * 100);

        const refund = await razorpay.payments.refund(paymentId, {
            amount: amountInPaise,
            notes: {
                ...notes,
                reason: "Admin/System processed refund"
            }
        });

        return { success: true, id: refund.id, refund };
    } catch (error: any) {
        console.error("Razorpay Refund Error:", error);
        throw new Error(error.description || error.message || "Refund failed");
    }
}
