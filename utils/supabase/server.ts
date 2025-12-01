import { createServerClient } from '@supabase/ssr';

export async function createClient(cookieStore: any) {

  return createServerClient(
    process.env.APPLE_DB_SUPABASE_URL!,
    process.env.APPLE_DB_SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        async getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value }) =>
              cookieStore.set(name, value)
            )
          } catch {
          }
        },
      },
    }
  );
}
