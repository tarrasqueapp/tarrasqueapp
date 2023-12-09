import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getProfile } from '@/actions/profiles';
import { createBrowserClient } from '@/utils/supabase/client';

/**
 * Get the user profile
 * @returns User profile query
 */
export function useGetProfile() {
  const queryClient = useQueryClient();

  // Listen for changes to the user profile and update the cache
  useEffect(() => {
    const supabase = createBrowserClient();
    const channel = supabase
      .channel('profile')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, async () => {
        // Refetch the profile to get the joined data
        const profile = await getProfile();

        // Update the cache
        queryClient.setQueryData(['profile'], profile);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });
}
