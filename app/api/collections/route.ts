import { NextResponse } from 'next/server';
import { productService } from '@/lib/services/product.service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const searchQuery = searchParams.get('searchQuery') || '';
  const category = searchParams.get('category') || '';
  const sortBy = searchParams.get('sortBy') || 'id';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');

  try {
    const result = await productService.getProducts({
      searchQuery,
      category,
      sortBy,
      sortOrder,
      page,
      pageSize
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
