import { EntityMapping } from "@/utils/supabase/entitymapping";
import GenericRepo from "@/utils/supabase/genericRepo";
import { NextResponse } from "next/server";

interface Params {
  params: { entityname: string; id?: string };
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { entityname } = await params;

    if (!(entityname in EntityMapping)) {
      throw new Error("Invalid entity name");
    }

    const requestData = await req.json();

    const genericRepo = new GenericRepo<typeof requestData>(entityname);

    const createdEntity = await genericRepo.create(requestData);

    return NextResponse.json({ createdEntity });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { entityname } = await params;
    if (!(entityname in EntityMapping)) {
      throw new Error("Invalid entity name");
    }

    const allEntities = await GenericRepo.fetchAll(entityname);
    return NextResponse.json({ data: allEntities });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { entityname, id } = await params;

    if (!(entityname in EntityMapping)) {
      throw new Error("Invalid entity name");
    }
    if (!id) throw new Error("ID parameter required for update");

    const partialData = await req.json();

    const genericRepo = new GenericRepo<typeof partialData>(entityname, id);

    await genericRepo.update(partialData);

    return NextResponse.json({ message: "Update successful" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update data" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { entityname, id } = await params;

    if (!(entityname in EntityMapping)) {
      throw new Error("Invalid entity name");
    }
    if (!id) throw new Error("ID parameter required for delete");

    const genericRepo = new GenericRepo(entityname, id);

    await genericRepo.delete();

    return NextResponse.json({ message: "Deletion successful" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete data" },
      { status: 500 }
    );
  }
}
