import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { Profile, getProfile } from '@/actions/profiles';
import { createBrowserClient } from '@/utils/supabase/client';

/**
 * Get the user profile
 * @returns User profile query
 */
export function useGetProfile() {
  const queryClient = useQueryClient();

  // Listen for changes to the user profile and update the cache
  useEffect(() => {
    let supabase: SupabaseClient;
    let channel: RealtimeChannel;

    requestAnimationFrame(() => {
      supabase = createBrowserClient();
      channel = supabase
        .channel('profile')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, async () => {
          const previousProfile = queryClient.getQueryData<Profile>(['profile']);

          // Refetch the profile to get the joined data
          const { data: profile } = await getProfile();
          if (!profile) return;

          // Update the cache
          queryClient.setQueryData(['profile'], profile);

          // If the campaign order changed, refetch the campaigns
          if (previousProfile?.campaign_order !== profile.campaign_order) {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
          }
        })
        .subscribe();
    });

    return () => {
      if (!supabase || !channel) return;
      supabase.removeChannel(channel);
    };
  }, []);

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await getProfile();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });
}
