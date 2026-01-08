
import { getShiprocketRates } from "@/lib/shiprocket";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const delivery_pincode = searchParams.get("pincode");
    const weight = parseFloat(searchParams.get("weight") || "0.5");

    if (!delivery_pincode) {
        return NextResponse.json({ error: "Pincode is required" }, { status: 400 });
    }

    // Default pickup pincode if not provided in env
    const pickup_pincode = process.env.SHIPROCKET_PICKUP_PINCODE || "508207";

    try {
        const rates = await getShiprocketRates({
            pickup_pincode,
            delivery_pincode,
            weight,
            cod: 0, // Default to prepaid for estimation
        });

        // Shiprocket returns serviceability data which includes rates
        return NextResponse.json(rates);
    } catch (error: any) {
        console.error("Rates API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
