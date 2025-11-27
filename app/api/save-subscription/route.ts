import { supabase } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, subscription } = await req.json();
    const { endpoint, keys } = subscription;
    const { p256dh, auth } = keys;

    const { data: existing } = await supabase
      .from('push_subscriptions')
      .select('endpoint')
      .eq('endpoint', endpoint)
      .maybeSingle();

    if (!existing) {
      const { error } = await supabase.from('push_subscriptions').insert({
        user_id: userId,
        endpoint,
        p256dh,
        auth,
      });

      if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ ok: true, inserted: true, exists: false });
    }

    return NextResponse.json({ ok: true, inserted: false, exists: true });

  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
