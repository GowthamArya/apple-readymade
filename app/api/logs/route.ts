import { supabase } from '@/lib/supabaseServer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, stack, url, user_agent } = body;
        if (process.env.NODE_ENV === 'development') return;
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
            return;
        }
        return;
    } catch (err: any) {
        console.error('Log route error:', err);
        return;
    }
}
