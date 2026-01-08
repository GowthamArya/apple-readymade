import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabaseServer';


export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
        .from('favourite')
        .select('variant_id')
        .eq('user_id', session.user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { variant_id, action } = await req.json();

    if (action === 'clear') {
        await supabase.from('favourite').delete().eq('user_id', session.user.id);
    } else if (action === 'remove') {
        await supabase.from('favourite').delete().eq('user_id', session.user.id).eq('variant_id', variant_id);
    } else {
        await supabase.from('favourite').insert({
            user_id: session.user.id,
            variant_id
        });
    }

    return NextResponse.json({ success: true });
}
