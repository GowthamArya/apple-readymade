import { supabase } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, subscription } = await req.json();
    const { endpoint, keys } = subscription;
    const { p256dh, auth } = keys;

    const {data,error} = await supabase.from('push_subscriptions').insert({
      user_id: userId,
      endpoint,
      p256dh,
      auth,
    });
    console.log(data,error)
    return NextResponse.json({ ok: true });

  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
