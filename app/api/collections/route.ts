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

  const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;

  const colorsParam = searchParams.get('colors');
  const colors = colorsParam ? colorsParam.split(',') : undefined;

  const sizesParam = searchParams.get('sizes');
  const sizes = sizesParam ? sizesParam.split(',') : undefined;

  const inStock = searchParams.get('inStock') === 'true';

  try {
    const result = await productService.getProducts({
      searchQuery,
      category,
      sortBy,
      sortOrder,
      page,
      pageSize,
      minPrice,
      maxPrice,
      colors,
      sizes,
      inStock
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
