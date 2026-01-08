import { NextResponse } from 'next/server';
import { getCartDetails } from '@/lib/productService';

export async function POST(req: Request) {
    const { variantIds } = await req.json();
    if (!variantIds || !Array.isArray(variantIds)) {
        return NextResponse.json({ error: 'Invalid variantIds' }, { status: 400 });
    }

    const details = await getCartDetails(variantIds);
    return NextResponse.json(details);
}
