import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

import { config } from '../../lib/config';
import { Database } from './types';

export function createClient(): SupabaseClient<Database> {
  return createBrowserClient<Database>(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
}
