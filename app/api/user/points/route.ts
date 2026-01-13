
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabaseServer";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ points: 0, history: [] });
    }

    const { searchParams } = new URL(req.url);
    const includeHistory = searchParams.get('history') === 'true';

    // Parallel fetch if history is requested
    const pointsPromise = supabase.rpc('get_user_points', { user_uuid: session.user.id });

    // Handle history promise
    let historyPromise: any;
    if (includeHistory) {
        historyPromise = supabase
            .from('loyalty_points')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .then(res => res); // Convert to promise
    } else {
        historyPromise = Promise.resolve({ data: [], error: null });
    }

    const [pointsResult, historyResult] = await Promise.all([
        pointsPromise,
        historyPromise
    ]);

    const { data: points, error: pointsError } = pointsResult;
    const { data: history, error: historyError } = historyResult;

    if (pointsError) {
        console.error("Error fetching points:", pointsError);
        return NextResponse.json({ error: 'Failed to fetch points' }, { status: 500 });
    }

    return NextResponse.json({
        points: points || 0,
        history: history || []
    });
}
