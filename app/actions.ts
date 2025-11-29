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
  console.log(sub);
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

export async function sendNotification(message: string, userId?: string) {
  try {
    let query = supabase.from('push_subscriptions').select('*');

    if (userId) {
      query = query.eq('user_id', userId);
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
          title: 'New Notification 📢',
          body: message,
          icon: '/logo.png',
          url: '/', // Add URL if needed
        })
      ).catch((err: any) => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Subscription has expired or is no longer valid
          console.log('Subscription expired, deleting from DB:', sub.id);
          return supabase.from('push_subscriptions').delete().eq('id', sub.id);
        }
        console.error('Error sending notification to', sub.user_id, err);
      });
    });

    await Promise.all(notifications);
    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}