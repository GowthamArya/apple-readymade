
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabaseServer";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ points: 0 });
    }

    const { data: points, error } = await supabase
        .rpc('get_user_points', { user_uuid: session.user.id });

    if (error) {
        console.error("Error fetching points:", error);
        return NextResponse.json({ error: 'Failed to fetch points' }, { status: 500 });
    }

    return NextResponse.json({ points: points || 0 });
}
