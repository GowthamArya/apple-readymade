import { NextResponse } from "next/server";
import { fetchWithRelations, uploadVariantFileToStorage } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const skip = searchParams.get('skip') || '0';
  const pageSize = searchParams.get('pageSize') || '20';
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'created_on';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const allDefaultVariants = await fetchWithRelations('variant', ['product.category'])
  .eq('is_default', true)
  .ilike('product.name', `%${search}%`)  
  .ilike('product.category.name', `%${category}%`) 
  .range(parseInt(skip), parseInt(skip) + parseInt(pageSize) - 1)
  .order(sortBy, { ascending: sortOrder === 'asc' });


  if (allDefaultVariants.error) {
    return NextResponse.json({ error: allDefaultVariants.error.message }, { status: 500 });
  }
  return NextResponse.json(allDefaultVariants.data);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const productId = formData.get("productId") as string || "1";
    const variantId = formData.get("variantId") as string || "1";

    if (!file || !productId || !variantId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const publicUrl =  await uploadVariantFileToStorage(file);

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
