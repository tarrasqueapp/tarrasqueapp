import { createBrowserClient as supabaseCreateBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

import { config } from '@/utils/config';

import { Database } from './types.gen';

export function createBrowserClient(): SupabaseClient<Database> {
  return supabaseCreateBrowserClient<Database>(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
}
