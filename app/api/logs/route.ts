import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseServer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, stack, url, user_agent } = body;
        if (process.env.NODE_ENV === 'development') return NextResponse.json({ success: true }, { status: 200 });
        // Insert the new log
        const { data, error } = await supabase
            .from('error_logs')
            .insert({
                message,
                stack,
                url,
                user_agent,
            });
        console.log(data, body);
        if (error) {
            console.error('Error inserting log:', error);
            return NextResponse.json({ error: 'Failed to log error' }, { status: 500 });
        }
        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Log route error:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
