import { CookieOptions, createServerClient as supabaseCreateServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { config } from '@/lib/config';

import { Database } from './types.gen';

export function createServerClient(cookieStore: ReturnType<typeof cookies>) {
  return supabaseCreateServerClient<Database>(config.SUPABASE_URL, config.SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
