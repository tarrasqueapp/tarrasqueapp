import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { getUser } from '@/actions/auth';
import { createBrowserClient } from '@/utils/supabase/client';

/**
 * Get the user
 * @returns User query
 */
export function useGetUser() {
  const [supabase] = useState(createBrowserClient());
  const queryClient = useQueryClient();

  const queryKey = ['user'];

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      // Update the user when their details change
      if (session && event === 'USER_UPDATED') {
        queryClient.setQueryData(queryKey, session.user);
      }

      // Remove all cached queries when the user signs out
      if (event === 'SIGNED_OUT') {
        queryClient.cancelQueries();
        setTimeout(() => queryClient.clear(), 100);
      }
    });
  }, []);

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await getUser();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });
}
