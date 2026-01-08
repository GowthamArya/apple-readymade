import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabaseServer';

async function getCustomerId(email: string) {
    const { data, error } = await supabase
        .from('customer')
        .select('id')
        .eq('email', email)
        .single();

    if (error || !data) return null;
    return data.id;
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customerId = await getCustomerId(session.user.email);
    if (!customerId) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const { data, error } = await supabase
        .from('cart')
        .select('variant_id, quantity')
        .eq('customer_id', customerId);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { variant_id, quantity, action } = await req.json();
    const customerId = await getCustomerId(session.user.email);
    if (!customerId) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

    if (action === 'clear') {
        const { error } = await supabase
            .from('cart')
            .delete()
            .eq('customer_id', customerId);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ success: true });
    }

    if (action === 'remove') {
        const { error } = await supabase
            .from('cart')
            .delete()
            .eq('customer_id', customerId)
            .eq('variant_id', variant_id);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ success: true });
    }

    // Update or Insert
    const { data: existing } = await supabase
        .from('cart')
        .select('id, quantity')
        .eq('customer_id', customerId)
        .eq('variant_id', variant_id)
        .single();

    if (existing) {
        const newQuantity = action === 'set' ? quantity : existing.quantity + quantity;
        if (newQuantity <= 0) {
            await supabase.from('cart').delete().eq('id', existing.id);
        } else {
            await supabase.from('cart').update({ quantity: newQuantity }).eq('id', existing.id);
        }
    } else if (quantity > 0) {
        await supabase.from('cart').insert({
            customer_id: customerId,
            variant_id,
            quantity
        });
    }

    return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const customerId = await getCustomerId(session.user.email);
    if (!customerId) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

    const { variant_id } = await req.json();

    if (variant_id) {
        await supabase.from('cart').delete().eq('customer_id', customerId).eq('variant_id', variant_id);
    } else {
        await supabase.from('cart').delete().eq('customer_id', customerId);
    }

    return NextResponse.json({ success: true });
}
