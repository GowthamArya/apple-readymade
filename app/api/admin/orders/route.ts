import { supabase } from "@/lib/supabaseServer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

        const { id, status } = await req.json();

        if (!id || !status) {
            return Response.json({ error: "Missing fields" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("orders")
            .update({ status })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return Response.json({ order: data });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
