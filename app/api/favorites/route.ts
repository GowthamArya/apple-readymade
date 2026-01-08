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
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const customerId = await getCustomerId(session.user.email);
    if (!customerId) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

    const { data, error } = await supabase
        .from('favourite')
        .select('variant_id')
        .eq('customer_id', customerId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { variant_id, action } = await req.json();
    const customerId = await getCustomerId(session.user.email);
    if (!customerId) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

    if (action === 'clear') {
        await supabase.from('favourite').delete().eq('customer_id', customerId);
    } else if (action === 'remove') {
        await supabase.from('favourite').delete().eq('customer_id', customerId).eq('variant_id', variant_id);
    } else {
        await supabase.from('favourite').insert({
            customer_id: customerId,
            variant_id
        });
    }

    return NextResponse.json({ success: true });
}
