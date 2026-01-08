
import { getShiprocketTracking } from "@/lib/shiprocket";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const shipmentId = searchParams.get("shipmentId");

    if (!shipmentId) {
        return NextResponse.json({ error: "Shipment ID is required" }, { status: 400 });
    }

    try {
        const trackingData = await getShiprocketTracking(shipmentId);
        return NextResponse.json(trackingData);
    } catch (error: any) {
        console.error("Tracking API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
