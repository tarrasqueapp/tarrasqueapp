import { useQuery } from '@tanstack/react-query';

import { getCampaign } from '@/actions/campaigns';

/**
 * Get a campaign by ID
 * @param campaignId - The id of the campaign to get
 * @returns Campaign query
 */
export function useGetCampaign(campaignId: string) {
  return useQuery({
    queryKey: ['campaigns', campaignId],
    queryFn: () => getCampaign(campaignId),
    enabled: Boolean(campaignId),
  });
}
