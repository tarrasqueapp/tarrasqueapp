import { SupabaseClient } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getUser } from '@/actions/auth';
import { createBrowserClient } from '@/utils/supabase/client';

/**
 * Get the user
 * @returns User query
 */
export function useGetUser() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let supabase: SupabaseClient;

    requestAnimationFrame(() => {
      supabase = createBrowserClient();
      supabase.auth.onAuthStateChange((event, session) => {
        // Update the user when their details change
        if (session && event === 'USER_UPDATED') {
          queryClient.setQueryData(['user'], session.user);
        }

        // Remove all cached queries when the user signs out
        if (event === 'SIGNED_OUT') {
          queryClient.cancelQueries();
          setTimeout(() => queryClient.clear(), 100);
        }
      });
    });
  }, []);

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await getUser();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });
}
