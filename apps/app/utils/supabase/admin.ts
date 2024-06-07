import { createServerClient as supabaseCreateServerClient } from '@supabase/ssr';
import { Database } from '@tarrasque/common';

import { config } from '@/utils/config';

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
