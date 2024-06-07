import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Profile, getProfile } from '@/actions/profiles';

import { useSupabaseSubscription } from '../useSupabaseSubscription';
import { useGetUser } from './useGetUser';

/**
 * Get the user profile
 * @returns User profile query
 */
export function useGetProfile() {
  const { data: user } = useGetUser();
  const queryClient = useQueryClient();

  const queryKey = ['profile'];

  useSupabaseSubscription({
    channelName: 'profile',
    table: 'profiles',
    filter: `id=eq.${user?.id}`,
    onChange: async () => {
      const previousProfile = queryClient.getQueryData<Profile>(queryKey);

      // Refetch the profile to get the joined data
      const { data: profile } = await getProfile();
      if (!profile) return;

      // Update the cache
      queryClient.setQueryData(queryKey, profile);

      // If the campaign order changed, refetch the campaigns
      if (previousProfile?.campaign_order !== profile.campaign_order) {
        queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      }
    },
  });

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await getProfile();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });
}
