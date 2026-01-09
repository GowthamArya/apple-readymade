import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";
import { cancelShiprocketOrder } from "@/lib/shiprocket";
import Razorpay from "razorpay";

function getRazorpay() {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
        throw new Error("Razorpay env vars missing");
    }
    return new Razorpay({ key_id, key_secret });
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { orderId } = await req.json();
        if (!orderId) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
        }

        // 1. Fetch order and verify ownership
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .eq('user_id', session.user.id)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // 2. Check if order can be cancelled
        // Orders can be cancelled if status is 'paid' or 'pending'
        // Should not be 'shipped', 'delivered', 'cancelled', or 'returned'
        const nonCancellableStatuses = ['shipped', 'delivered', 'cancelled', 'returned', 'return_requested'];
        if (nonCancellableStatuses.includes(order.status)) {
            return NextResponse.json({ error: `Order cannot be cancelled. Current status: ${order.status}` }, { status: 400 });
        }

        // 3. Refund via Razorpay if paid
        if (order.status === 'paid' && order.razorpay_payment_id) {
            try {
                const razorpay = getRazorpay();
                // Refund full amount (in paise)
                const refundAmount = Math.round(order.total_amount * 100);
                await razorpay.payments.refund(order.razorpay_payment_id, {
                    amount: refundAmount,
                    notes: {
                        reason: "User cancelled order",
                        order_id: order.id.toString()
                    }
                });
                console.log(`Refunded ${refundAmount} for order ${order.id}`);
            } catch (refundError: any) {
                console.error("Razorpay Refund Error:", refundError);
                // We might still want to proceed with DB update if refund fails (or handle it)
                // But for safety, maybe return error if refund is critical
                return NextResponse.json({ error: "Failed to process refund. Please contact support." }, { status: 500 });
            }
        }

        // 4. Cancel Shiprocket order if exists
        if (order.shiprocket_order_id) {
            try {
                await cancelShiprocketOrder([order.shiprocket_order_id.toString()]);
            } catch (srError) {
                console.error("Shiprocket Cancel Error (Non-critical):", srError);
                // Non-critical because we can cancel it manually if needed, but we should try
            }
        }

        // 5. Update Order Status in DB
        const { error: updateError } = await supabase
            .from('orders')
            .update({ status: 'cancelled' })
            .eq('id', orderId);

        if (updateError) {
            throw updateError;
        }

        // 6. Return points if redeemed
        if (order.points_redeemed > 0) {
            await supabase
                .from('loyalty_points')
                .insert({
                    user_id: order.user_id,
                    points: order.points_redeemed,
                    transaction_type: 'refund',
                    order_id: order.id.toString(),
                    amount: order.points_amount
                });
        }

        return NextResponse.json({ success: true, message: "Order cancelled successfully" });
    } catch (error: any) {
        console.error("Cancel Order API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to cancel order" }, { status: 500 });
    }
}
