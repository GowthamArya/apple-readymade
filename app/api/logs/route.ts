import { supabase } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

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
            return NextResponse.json({ success: false }, { status: 500 });
        }
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err: any) {
        console.error('Log route error:', err);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
