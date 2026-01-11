import { supabase } from "@/lib/supabaseServer";
const webpush = require('web-push');

webpush.setVapidDetails(
    `mailto:gowtham.arya999@gmail.com`,
    process.env.NEXT_PUBLIC_VAPID_KEY,
    process.env.VAPID_PRIVATE_KEY
)

export async function sendNotification(
    title?: string,
    message?: string,
    userEmail?: string,
    url?: string,
    image?: string
) {
    try {
        let query = supabase
            .from('push_subscriptions')
            .select('*, user:user(email)');

        if (userEmail) {
            query = query.eq('user.email', userEmail);
        }

        const { data: subscriptions, error } = await query;

        if (error || !subscriptions) {
            console.error("Error fetching subscriptions:", error);
            return { success: false, error: "Failed to fetch subscriptions" };
        }

        const notifications = subscriptions.map(sub => {
            const pushSubscription = {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth,
                },
            };

            return webpush.sendNotification(
                pushSubscription,
                JSON.stringify({
                    title: title || 'New Notification 📢',
                    body: message || 'New Notification 📢',
                    icon: '/logo.png',
                    vibrate: [200, 100, 200],
                    badge: '/logo.png',
                    tag: 'new-notification',
                    image: image || '/logo.png',
                    actions: [
                        {
                            action: 'view',
                            title: 'View',
                        },
                        {
                            action: 'close',
                            title: 'Close',
                        },
                        {
                            action: 'mark-as-read',
                            title: 'Mark as Read',
                        },
                    ],
                    renotify: true,
                    requireInteraction: true,
                    url: url || '/',
                })
            ).catch(async (err: any) => {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    console.log('Removing expired subscription:', sub.id);
                    await supabase.from('push_subscriptions').delete().eq('id', sub.id);
                } else {
                    console.error('Push error for user', sub.user_id, err);
                }
            });
        });

        let { data } = await supabase.from('user').select('email') as any;
        if (userEmail) {
            data = data || []; // Handle case where data is null

            if (userEmail) {
                const currentData = data ? [...data] : [];
                currentData.push({ email: userEmail });
                data = currentData.filter(({ email }: { email: string }) => email !== userEmail);
            }
        }

        // Original Loop
        if (data) {
            data.map(async ({ email }: { email: string }) => {
                await supabase.from('notifications').insert({
                    title: title || 'New Notification 📢',
                    message: message || 'New Notification 📢',
                    url: url || '/',
                    image: image || '/logo.png',
                    user_email: email,
                    is_read: false,
                });
            });
        }

        await Promise.all(notifications);
        return { success: true, pushSentCount: subscriptions.length };
    } catch (err) {
        console.error('Unexpected push failure:', err);
        return { success: false, error: 'Failed to send notification' };
    }
}
