
import { getShiprocketPincodeDetails } from "@/lib/shiprocket";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const pincode = searchParams.get("pincode");

    if (!pincode || pincode.length !== 6) {
        return NextResponse.json({ error: "Valid 6-digit Pincode is required" }, { status: 400 });
    }

    try {
        const details = await getShiprocketPincodeDetails(pincode);
        return NextResponse.json(details);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
