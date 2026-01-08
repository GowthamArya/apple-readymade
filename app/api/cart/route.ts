import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabaseServer';


export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('cart')
        .select('variant_id, quantity')
        .eq('user_id', session.user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { variant_id, quantity, action } = await req.json();

    if (action === 'clear') {
        const { error } = await supabase
            .from('cart')
            .delete()
            .eq('user_id', session.user.id);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ success: true });
    }

    if (action === 'remove') {
        const { error } = await supabase
            .from('cart')
            .delete()
            .eq('user_id', session.user.id)
            .eq('variant_id', variant_id);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ success: true });
    }

    // Update or Insert
    const { data: existing } = await supabase
        .from('cart')
        .select('id, quantity')
        .eq('user_id', session.user.id)
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
            user_id: session.user.id,
            variant_id,
            quantity
        });
    }

    return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { variant_id } = await req.json();

    if (variant_id) {
        await supabase.from('cart').delete().eq('user_id', session.user.id).eq('variant_id', variant_id);
    } else {
        await supabase.from('cart').delete().eq('user_id', session.user.id);
    }

    return NextResponse.json({ success: true });
}
