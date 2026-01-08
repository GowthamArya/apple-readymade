import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabaseServer";
import { redirect } from "next/navigation"
import OrderDetails from "@/app/components/OrderDetails";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/auth");
    }
    const { data: order, error } = await supabase
        .from("orders")
        .select("*, order_items(*, product(*, variant(*)))") // Nested fetch might need adjustment depending on schema
        .eq("id", (await params).id)
        .eq("user_id", session?.user.id) // Ensure user owns the order
        .single();

    if (error || !order) {
        console.error("Error fetching order:", error);
        return <div className="p-8">Order not found or access denied.</div>;
    }

    return <OrderDetails order={order} />
}
