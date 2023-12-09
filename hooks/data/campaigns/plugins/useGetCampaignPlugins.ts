import { useQuery } from '@tanstack/react-query';

import { getCampaignPlugins } from '@/actions/plugins';

/**
 * Get the campaign's plugins
 * @param campaignId - The campaign to get plugins for
 * @returns Campaign plugins query
 */
export function useGetCampaignPlugins(campaignId: string | undefined) {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'plugins'],
    queryFn: () => getCampaignPlugins(campaignId!),
    enabled: Boolean(campaignId),
  });
}
