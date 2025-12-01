import GenericRepo from "@/utils/supabase/genericRepo";
import { NextResponse } from "next/server";
import redis from "@/lib/infrastructure/redis";

async function invalidateCache(entityName: string) {
  try {
    // Clear specific entity cache
    const keys = await redis.keys(`*${entityName}*`);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`Cleared cache for ${entityName}:`, keys);
    }

    // Also clear flash sales cache if related
    if (entityName === 'flash_sales') {
      await redis.del("flash_sales:active");
    }

    // Clear collections/products cache if variants, products, categories, or reviews are modified
    if (['variant', 'product', 'product_variant', 'category', 'reviews'].includes(entityName)) {
      const productKeys = await redis.keys('product:*');
      if (productKeys.length > 0) {
        await redis.del(...productKeys);
        console.log('Cleared products cache');
      }
    }

    // Clear similar variants cache if variants are modified
    if (entityName === 'variant') {
      const similarKeys = await redis.keys('similar:*');
      if (similarKeys.length > 0) {
        await redis.del(...similarKeys);
        console.log('Cleared similar variants cache');
      }
    }
  } catch (e) {
    console.error("Cache invalidation error:", e);
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ entityname: string; id?: string }> }
) {
  try {
    const { entityname } = await params;

    const requestData = await req.json();
    const genericRepo = new GenericRepo<typeof requestData>(entityname);
    const createdEntity = await genericRepo.create(requestData);
    await invalidateCache(entityname);

    return NextResponse.json({ createdEntity });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to process request' }, { status: 500 });
  }
}


export async function GET(
  req: Request,
  { params }: { params: Promise<{ entityname: string; }> }
) {
  try {
    const { entityname } = await params;
    const url = new URL(req.url);

    const id = url.searchParams.get("id") || undefined;
    const filters = url.searchParams.get("filters") ? JSON.parse(url.searchParams.get("filters") as string) : undefined;
    const search = url.searchParams.get("search") ? JSON.parse(url.searchParams.get("search") as string) : undefined;
    const pagination = url.searchParams.get("pagination") ? JSON.parse(url.searchParams.get("pagination") as string) : undefined;
    const orderBy = url.searchParams.get("orderBy") ? JSON.parse(url.searchParams.get("orderBy") as string) : undefined;


    const allEntities = await GenericRepo.fetchAll(entityname, id, { filters, search, pagination, orderBy });
    return NextResponse.json(allEntities);
  } catch (err: any) {
    return NextResponse.json({ data: [], error: err.message || 'Failed to fetch data' }, { status: 500 });
  }
}


export async function PUT(
  req: Request,
  { params }: { params: Promise<{ entityname: string; }> }
) {
  try {
    // const {session}:any = await getServerSession(authOptions);
    // const user = session?.user;
    // if(!user || user?.role_name?.toLowerCase() !== 'admin'){
    //   return NextResponse.json({ error: 'Access Denied' }, { status: 403 });
    // }
    const { entityname } = await params;
    const url = new URL(req.url);
    const id = url.searchParams.get("id") || undefined;
    if (!id) throw new Error("ID parameter required for update");

    const partialData = await req.json();
    const genericRepo = new GenericRepo<typeof partialData>(entityname, id);
    await genericRepo.update(partialData);
    await invalidateCache(entityname);

    return NextResponse.json({ message: "Update successful" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update data" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ entityname: string }> }
) {
  try {
    // const {session}:any = await getServerSession(authOptions);
    // const user = session?.user;
    // if(!user || user?.role_name?.toLowerCase() !== 'admin'){
    //   return NextResponse.json({ error: 'Access Denied' }, { status: 403 });
    // }
    const { entityname } = await params;
    const url = new URL(req.url);
    const id = url.searchParams.get("id") || undefined;
    if (!id) throw new Error("ID parameter required for delete");

    const genericRepo = new GenericRepo(entityname, id);
    await genericRepo.delete();
    await invalidateCache(entityname);

    return NextResponse.json({ message: "Deletion successful" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete data" }, { status: 500 });
  }
}