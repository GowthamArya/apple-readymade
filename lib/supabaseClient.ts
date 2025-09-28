import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.APPLE_DB_SUPABASE_URL!,
  process.env.APPLE_DB_APPLE_SUPABASE_SUPABASE_ANON_KEY!
);

export default supabase;
