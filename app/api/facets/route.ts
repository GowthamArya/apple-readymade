import { NextResponse } from 'next/server';
import { productService } from '@/lib/services/product.service';

export async function GET() {
    try {
        const facets = await productService.getFilterFacets();
        return NextResponse.json(facets);
    } catch (error) {
        console.error('Error fetching facets:', error);
        return NextResponse.json({ error: 'Failed to fetch search facets' }, { status: 500 });
    }
}
