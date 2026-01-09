import { runAbandonedCartReminders } from "@/lib/reminders";

export async function GET(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    const result = await runAbandonedCartReminders();

    if (result.success) {
        console.log("Cron job completed at ", new Date().toISOString(), " Sent:", result.sent);
        return Response.json(result);
    } else {
        console.error("Cron job failed", result.error);
        return Response.json({ error: result.error }, { status: 500 });
    }
}
