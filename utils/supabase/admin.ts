import { createServerClient as supabaseCreateServerClient } from '@supabase/ssr';

import { config } from '@/lib/config';

import { Database } from './types.gen';

export function createAdminServerClient() {
  return supabaseCreateServerClient<Database>(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, {
    cookies: {
      get() {
        return undefined;
      },
      set() {},
      remove() {},
    },
  });
}
