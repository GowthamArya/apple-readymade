import { sendNotification } from "@/app/actions";
import { supabase } from "@/lib/supabaseServer";

export async function GET(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }
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
          product (
            name,
            image_urls
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
            // Send notification (Email/Push)
            try {
                await sendNotification(title, message, userEmail, url);
                // Mark as sent
                await supabase.from('cart').update({ reminder_sent_at: new Date().toISOString() }).eq('id', cart.id);
                count++;
            } catch (e) {
                console.error("Failed to send notification for cart", cart.id, e);
            }
        }

        return Response.json({ success: true, sent: count });
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 500 });
    } finally {
        console.log("Cron job completed at ", new Date().toISOString());
    };
}
