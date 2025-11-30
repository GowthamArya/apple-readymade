
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabaseServer";

export async function GET() {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
        return NextResponse.json({ notifications: [] });
    }

    // Fetch broadcast notifications (user_email is null) OR user-specific notifications
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .or(`user_email.is.null,user_email.eq.${userEmail}`)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }

    return NextResponse.json({ notifications: data });
}

export async function PUT(req: Request) {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    // Since we don't have a user_notifications table for broadcasts, 
    // we can only mark specific user notifications as read easily.
    // For now, we'll just update the row if it exists.

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Allow deleting if the notification belongs to the user OR if it's a broadcast (user_email is null)
    // Note: Deleting a broadcast removes it for everyone.
    const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        // We want to ensure we don't delete someone else's private notification.
        // So we check if user_email is null OR user_email equals current user.
        // However, Supabase delete with .eq('id', id) will delete it regardless of other columns unless we add filters.
        // So we should add the filter logic.
        .or(`user_email.is.null,user_email.eq.${userEmail}`);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
