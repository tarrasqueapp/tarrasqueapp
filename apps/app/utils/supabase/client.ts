import { createBrowserClient as supabaseCreateBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@tarrasque/common';

import { config } from '@/utils/config';

export function createBrowserClient(): SupabaseClient<Database> {
  return supabaseCreateBrowserClient<Database>(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
}
