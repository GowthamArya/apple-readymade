import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { orderId, reason } = await req.json();
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

        // 2. Check if order can be returned
        // Usually only if delivered
        // if (order.status !== 'delivered') {
        //   return NextResponse.json({ error: "Only delivered orders can be returned" }, { status: 400 });
        // }

        // 3. Update Order Status in DB
        const { error: updateError } = await supabase
            .from('orders')
            .update({
                status: 'return_requested',
                return_reason: reason // Assuming this column exists or we just want to track it
            })
            .eq('id', orderId);

        if (updateError) {
            // If return_reason column doesn't exist, try without it
            const { error: retryError } = await supabase
                .from('orders')
                .update({ status: 'return_requested' })
                .eq('id', orderId);

            if (retryError) throw retryError;
        }

        return NextResponse.json({ success: true, message: "Return requested successfully" });
    } catch (error: any) {
        console.error("Return Order API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to request return" }, { status: 500 });
    }
}
