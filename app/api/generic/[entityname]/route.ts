import GenericRepo from "@/utils/supabase/genericRepo";
import { NextResponse } from "next/server";
import redis from "@/lib/infrastructure/redis";

async function invalidateCache(entityName: string) {
  try {
    if (entityName === 'flash_sales') {
      await redis.del("flash_sales:active");
      console.log('Cleared flash_sales cache');
    } else {
      const flashSales = await redis.get("flash_sales:active");
      await redis.flushdb();
      if (flashSales) {
        await redis.set("flash_sales:active", flashSales, "EX", 60*60*24);
      }
      console.log(`Full cache flush triggered by ${entityName} update`);
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