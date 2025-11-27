import { NextResponse } from "next/server";
const webpush = require('web-push');
import { supabase } from "@/lib/supabaseServer";

function initWebPush() {
  if (!process.env.NEXT_PUBLIC_VAPID_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return false;
  }

  webpush.setVapidDetails(
    `mailto:gowtham.arya999@gmail.com`,
    process.env.NEXT_PUBLIC_VAPID_KEY,
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

  const unique = new Set<string>();
  const subs: any[] = [];

  for (const row of data) {
    if (!unique.has(row.endpoint)) {
      unique.add(row.endpoint);
      subs.push({
        endpoint: row.endpoint,
        keys: { p256dh: row.p256dh, auth: row.auth }
      });
    }
  }

  subs.forEach((sub) => {
    webpush.sendNotification(
      sub,
      JSON.stringify({ title, body: message })
    ).catch((err: any) => console.error("❌ Push failed:", err));
  });

  console.log(`${title} ${message}`);
  console.log("✅ Push sent to devices", subs.length);
}
