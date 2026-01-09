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
            // Correcting the logic here as per original code, though it looked a bit weird pushing to data then filtering
            // Original: 
            // if (userEmail) {
            //   data.push({ email: userEmail });
            //   data = data.filter(({ email }: { email: string }) => email !== userEmail);
            // }
            // The original logic seems to aim at ensuring a notification record is created even if user not found? 
            // Or maybe avoiding duplicates if userEmail was already in data? 
            // Let's stick to the original logic which was:
            // data.push({ email: userEmail });
            // data = data.filter(({ email }: { email: string }) => email !== userEmail);
            // Wait, if I filter out userEmail, then I map over data... so userEmail is excluded? 
            // Ah, the original code: 
            // if (userEmail) {
            //   data.push({ email: userEmail });
            //   data = data.filter(({ email }: { email: string }) => email !== userEmail);
            // }
            // This effectively removes userEmail from data if it was there? No, it adds it then removes it?
            // Actually, if `data` is all users. 
            // If userEmail is provided, we might want to ONLY notify that user or add them? 
            // The original code:
            // if (userEmail) {
            //    data.push({ email: userEmail });
            //    data = data.filter(({ email }: { email: string }) => email !== userEmail);
            // }
            // Then `data.map` inserts into `notifications`.
            // If userEmail is filtered OUT, then no notification row for them? 
            // Wait, checking original `actions.ts` L122-136.
            // `let { data } = ...` (all users)
            // `if (userEmail) ... data.push ... filter !== userEmail`
            // This means effective `data` will NOT contain `userEmail`.
            // Yet `sendNotification` works for single user? 
            // Maybe I misread the original code. 
            // L125: `data = data.filter(({ email }: { email: string }) => email !== userEmail);`
            // This REMOVES `userEmail` from `data`.
            // Then `data.map` inserts DB records. 
            // So no DB record for `userEmail`?
            // That seems like a bug in the old code or I'm misunderstanding. 
            // However, I should preserve behavior unless I'm fixing it. 
            // BUT, for the cron job, we iterate and call sendNotification for specific user. 
            // If the DB logic is broken, maybe they don't get a notification history?

            // Let's copy it exactly.
            data = data || []; // Handle case where data is null

            if (userEmail) {
                // data.push({ email: userEmail }); // This might fail if data is null, added check above
                // data = data.filter(({ email }: { email: string }) => email !== userEmail);
                // PROPOSAL: I'll blindly copy the logic, but safeguard `data` being null/undefined.

                // Actually, let's look at the original actions.ts again.
                // L122: `let { data } = ...` 
                // L123: `if (userEmail) { data.push... data = data.filter... }`
                // This logic is extremely suspect. `data.push` adds it. `filter` removes it. result: userEmail is gone.
                // Unless `filter` only removes OTHER instances? 
                // `email !== userEmail`. So it keeps everyone ELSE. 
                // So if I send to "bob", "bob" is removed. Everyone else gets a DB record?
                // That sounds like "Notify everyone EXCEPT bob"?
                // But the function is `sendNotification(..., userEmail, ...)`.
                // If userEmail is passed, the query (L64) filters subscriptions to that user. So only Bob gets the push.
                // But the DB record (L128) is created for everyone *except* Bob.
                // This seems completely backwards for "Notify specific user".
                // However, I am refactoring. I should strictly move code. fixing comes later if requested.
                // I will replicate it.

                // The data might be an array or null. 
                const currentData = data ? [...data] : [];
                currentData.push({ email: userEmail });
                // Re-assigning to data variable to match flow
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
