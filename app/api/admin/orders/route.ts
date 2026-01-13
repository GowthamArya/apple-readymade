import { supabase } from "@/lib/supabaseServer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { processRefund } from "@/lib/razorpay";
import { cancelShiprocketOrder } from "@/lib/shiprocket";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role_name !== "admin") {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: orders, error } = await supabase
            .from("orders")
            .select(`
        *,
        user:user_id(name, email),
        items:order_items(
          *,
          variant:variant_id(
            product:product_id(name),
            size,
            color
          )
        )
      `)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return Response.json({ orders });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role_name !== "admin") {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, status: newStatus } = await req.json();

        if (!id || !newStatus) {
            return Response.json({ error: "Missing fields" }, { status: 400 });
        }

        // Fetch current order details
        const { data: order, error: fetchError } = await supabase
            .from("orders")
            .select("*")
            .eq("id", id)
            .single();

        if (fetchError || !order) {
            return Response.json({ error: "Order not found" }, { status: 404 });
        }

        // Handle Side Effects
        if (newStatus === "cancelled") {
            // 1. Refund via Razorpay (only for cancellations)
            if (order.status !== "refunded" && order.razorpay_payment_id) {
                try {
                    await processRefund(order.razorpay_payment_id, order.total_amount, {
                        reason: `Admin changed status to cancelled`,
                        order_id: order.id.toString(),
                    });
                    console.log(`Refunded order ${id} via Razorpay`);
                } catch (err) {
                    console.error("Refund failed:", err);
                }
            }

            // 2. Cancel Shiprocket
            if (order.shiprocket_order_id) {
                try {
                    await cancelShiprocketOrder([order.shiprocket_order_id.toString()]);
                    console.log(`Cancelled Shiprocket order ${order.shiprocket_order_id}`);
                } catch (err) {
                    console.error("Shiprocket cancel failed:", err);
                }
            }
        }

        if (newStatus === "returned") {
            // 1. Credit to Loyalty Points (Store Credit) instead of Razorpay Refund
            // If order was paid (RAZORPAY) or COD (if we handle COD returns to wallet) - User implies "we dont return money to razor pay", implying it was paid.
            // We should credit the `total_amount`.
            if (order.status !== 'refunded') {
                const { error: creditError } = await supabase
                    .from("loyalty_points")
                    .insert({
                        user_id: order.user_id,
                        points: Math.round(order.total_amount), 
                        transaction_type: "store_credit",
                        order_id: order.id.toString(),
                        amount: order.total_amount, 
                        description: `Refund for Order #${order.id} (Store Credit)`
                    });

                if (creditError) console.error("Store credit failed:", creditError);
                else console.log(`Credited ${order.total_amount} points for order ${order.id}`);
            }
        }

        // Return Redeemed Points (applies to both Cancelled and Returned)
        if ((newStatus === "cancelled" || newStatus === "returned") && order.points_redeemed > 0) {
            const { error: pointsError } = await supabase
                .from("loyalty_points")
                .insert({
                    user_id: order.user_id,
                    points: order.points_redeemed,
                    transaction_type: "refund",
                    order_id: order.id.toString(),
                    amount: order.points_amount,
                    description: `Return of redeemed points for Order #${order.id}`
                });
            if (pointsError) console.error("Points return failed:", pointsError);
        }

        // Update Status
        const { data, error } = await supabase
            .from("orders")
            .update({ status: newStatus })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return Response.json({ order: data });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
