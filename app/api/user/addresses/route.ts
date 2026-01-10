
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: addresses, error } = await supabase
        .from("address")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("status_id", 1) // Assuming 1 is active
        .order("created_on", { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ addresses });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { line1, line2, street, city, pincode, state, country = "India" } = body;

    const { data, error } = await supabase
        .from("address")
        .insert([
            {
                user_id: session.user.id,
                line1,
                line2,
                street,
                city,
                pincode,
                state,
                country,
                status_id: 1,
            },
        ])
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ address: data });
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, line1, line2, street, city, pincode, state, country } = body;

    const { data, error } = await supabase
        .from("address")
        .update({
            line1,
            line2,
            street,
            city,
            pincode,
            state,
            country,
            updated_on: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", session.user.id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ address: data });
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Soft delete by setting status_id to null
    const { error } = await supabase
        .from("address")
        .update({ status_id: 2 })
        .eq("id", id)
        .eq("user_id", session.user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
