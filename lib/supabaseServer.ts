import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.APPLE_DB_SUPABASE_URL!,
  process.env.APPLE_DB_SUPABASE_SERVICE_ROLE_KEY!
);
