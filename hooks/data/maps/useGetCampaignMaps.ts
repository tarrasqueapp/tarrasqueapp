import { useQuery } from '@tanstack/react-query';

import { getMaps } from '@/actions/maps';

/**
 * Get the campaign's maps
 * @param campaignId - The ID of the campaign to get maps for
 * @returns Campaign maps query
 */
export function useGetCampaignMaps(campaignId?: string) {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'maps'],
    queryFn: () => getMaps(campaignId!),
    enabled: Boolean(campaignId),
  });
}
