
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import OrdersList from "./OrdersList";

export default async function OrdersPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/auth");
    }

    const { data: orders, error } = await supabase
        .from("orders")
        .select("*, order_items(*, product(*))")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching orders:", error);
        return <div>Failed to load orders.</div>;
    }

    return (
        <div className="px-4 md:px-8 lg:px-16 py-5">
            <h1 className="text-2xl text-center font-bold mb-4">My Orders</h1>
            <OrdersList orders={orders || []} />
        </div>
    );
}
