'use server'

import { supabase } from "@/lib/supabaseServer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Assuming authOptions is exported from here, adjust if needed

const webpush = require('web-push');

webpush.setVapidDetails(
  `mailto:gowtham.arya999@gmail.com`,
  process.env.NEXT_PUBLIC_VAPID_KEY,
  process.env.VAPID_PRIVATE_KEY
)

export async function subscribeUser(sub: PushSubscription) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "User not authenticated" };
  }
  const { endpoint, keys }: any = sub;

  const { error } = await supabase
    .from('push_subscriptions')
    .upsert({
      user_id: session.user.id,
      endpoint: endpoint,
      p256dh: keys?.p256dh,
      auth: keys?.auth,
    }, { onConflict: 'endpoint' });

  if (error) {
    console.error("Error saving subscription:", error);
    return { success: false, error: error.message };
  }
  else {
    console.log("Subscription saved successfully");
    return { success: true }
  }
}

export async function unsubscribeUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "User not authenticated" };
  }

  // In a real scenario, we might need the endpoint to delete a specific subscription
  // For now, we'll just return success as the browser handles the client-side unsubscribe
  return { success: true }
}

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
      data.push({ email: userEmail });
      data = data.filter(({ email }: { email: string }) => email !== userEmail);
    }
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
    await Promise.all(notifications);
    return { success: true };
  } catch (err) {
    console.error('Unexpected push failure:', err);
    return { success: false, error: 'Failed to send notification' };
  }
}
