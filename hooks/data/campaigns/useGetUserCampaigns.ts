import { useQuery } from '@tanstack/react-query';

import { getUserCampaigns } from '@/actions/campaigns';

/**
 * Get the user's campaigns
 * @returns Campaigns query
 */
export function useGetUserCampaigns() {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: getUserCampaigns,
  });
}
