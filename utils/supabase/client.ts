'use client';
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.APPLE_DB_SUPABASE_URL!,
    process.env.APPLE_DB_APPLE_SUPABASESUPABASE_ANON_KEY!
  );
}
