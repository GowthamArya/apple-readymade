
import { supabase } from "@/lib/supabaseServer";
import { sendNotification } from "@/lib/notificationService";
import { sendAbandonedCartEmail } from "@/lib/emailService";

export async function runAbandonedCartReminders() {
    try {
        // Logic: Find carts updated > 1 hour ago AND reminder_sent_at is NULL
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

        const { data: abandonedCarts, error } = await supabase
            .from('cart')
            .select(`
        id,
        user_id,
        quantity,
        variant_id,
        updated_on,
        reminder_sent_at,
        variant (
          image_urls,
          product (
            name
          )
        ),
        user (
          email
        )
      `)
            .lt('updated_on', oneHourAgo)
            .is('reminder_sent_at', null)
            .not('user_id', 'is', null);

        if (error) {
            console.error("Error fetching carts", error);
            throw error;
        }
        const carts = abandonedCarts || [];
        let count = 0;

        for (const cart of carts) {
            // Supabase join results can be single object or array depending on relation type.
            // Usually user is 1:1, variant is 1:1.
            const userData = Array.isArray(cart.user) ? cart.user[0] : cart.user;
            const userEmail = userData?.email;

            if (!userEmail) continue;

            const variantData = Array.isArray(cart.variant) ? cart.variant[0] : cart.variant;
            const productData = variantData?.product as any;
            const productName = Array.isArray(productData) ? productData[0]?.name : productData?.name || null;

            const title = "You left something behind!";
            const message = `Your ${productName || 'item'} is waiting for you. Complete your order now!`;
            const url = "/cart";
            const imageUrl = Array.isArray(variantData?.image_urls) ? variantData?.image_urls[0] : undefined;
            const fullUrl = "https://apple-readymade.vercel.app" + url;

            // Send notification (Email/Push)
            try {
                const res = await sendNotification(title, message, userEmail, url, imageUrl);
                // If push notification not sent (user not subscribed), send email
                if (res.success && typeof res.pushSentCount === 'number' && res.pushSentCount === 0) {
                    await sendAbandonedCartEmail(userEmail, productName || 'Item', fullUrl, imageUrl);
                }

                // Mark as sent
                await supabase.from('cart').update({ reminder_sent_at: new Date().toISOString() }).eq('id', cart.id);
                count++;
            } catch (e) {
                console.error("Failed to send notification for cart", cart.id, e);
            }
        }

        return { success: true, sent: count };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
