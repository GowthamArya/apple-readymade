
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabaseServer";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get('all') === 'true';

    let query = supabase
        .from('flash_sales')
        .select('*, product(*)');

    if (!showAll) {
        const now = new Date().toISOString();
        query = query
            .eq('active', true)
            .lte('start_time', now)
            .gte('end_time', now);
    }

    const { data: sales, error } = await query;

    if (error) {
        console.error("Error fetching flash sales:", error);
        return NextResponse.json({ error: 'Failed to fetch flash sales' }, { status: 500 });
    }

    return NextResponse.json({ sales });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) { // Ideally check for admin role
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { product_id, discount_percentage, start_time, end_time } = body;

        if (!product_id || !discount_percentage || !start_time || !end_time) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('flash_sales')
            .insert({
                product_id,
                discount_percentage,
                start_time,
                end_time,
                active: true
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating flash sale:", error);
            return NextResponse.json({ error: 'Failed to create flash sale' }, { status: 500 });
        }

        return NextResponse.json({ sale: data });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
