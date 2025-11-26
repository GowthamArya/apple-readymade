import { NextResponse } from "next/server";
const webpush = require('web-push');
import { supabase } from "@/lib/supabaseServer";

function initWebPush() {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return false;
  }

  webpush.setVapidDetails(
    `mailto:arya.dev@example.com`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  return true;
}

export async function POST(req: Request) {
  try {
    const ready = initWebPush();
    if (!ready) {
        return new Response("VAPID keys missing on server", { status: 500 });
    }
    
    const { title, message } = await req.json();
    await sendPushNotification(title, message);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("❌ Push API error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

async function sendPushNotification(title: string, message: string) {
  const { data, error } = await supabase.from("push_subscriptions").select("*");

  if (error) {
    console.error("❌ DB Read error:", error);
    return;
  }

  if (!data || data.length === 0) {
    console.warn("⚠ No subscriptions found in DB");
    return;
  }

  data.forEach((row) => {
    const sub = {
      endpoint: row.endpoint,
      keys: {
        p256dh: row.p256dh,
        auth: row.auth
      }
    };

    webpush.sendNotification(sub, JSON.stringify({
        title: title,
        body: message
    })).then(() => console.log("✅ Push sent to device"))
      .catch((err: any) => console.error("❌ Push failed:", err));
  });
}
