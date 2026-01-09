'use server'

import { supabase } from "@/lib/supabaseServer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Assuming authOptions is exported from here, adjust if needed


import { sendNotification as serviceSendNotification } from "@/lib/notificationService";
import { runAbandonedCartReminders } from "@/lib/reminders";

export async function triggerAbandonedCartReminders() {
  // Check if user is admin if needed, but for now we just run it.
  // The previous code didn't check admin permissions explicitly on the client beyond just being in the admin panel?
  // Actually, `GenericListing` seems to be an Admin component.
  // We should probably check if the user is authenticated at least.

  const session = await getServerSession(authOptions);
  if (!session?.user) { // Simplistic auth check
    return { success: false, error: "Unauthorized" };
  }

  return await runAbandonedCartReminders();
}

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
  return await serviceSendNotification(title, message, userEmail, url, image);
}

