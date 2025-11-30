
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabaseServer';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ canReview: false, reason: 'Not logged in' });
    }

    try {
        // Check if user has a delivered order containing this product
        const { data, error } = await supabase
            .from('orders')
            .select(`
                id,
                status,
                order_items!inner (
                product_id
                )
            `)
            .eq('user_id', session.user.id)
            .eq('status', 'delivered')
            .eq('order_items.product_id', productId)
            .limit(1);

        if (error) {
            console.error("Error checking review eligibility:", error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        const canReview = data && data.length > 0;
        return NextResponse.json({ canReview });

    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
