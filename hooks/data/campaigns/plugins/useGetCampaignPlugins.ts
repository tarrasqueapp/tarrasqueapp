import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getCampaignPlugins } from '@/actions/plugins';

import { useSupabaseSubscription } from '../../useSupabaseSubscription';

/**
 * Get the campaign's plugins
 * @param campaignId - The campaign to get plugins for
 * @returns Campaign plugins query
 */
export function useGetCampaignPlugins(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  const queryKey = ['campaigns', campaignId, 'plugins'];

  useSupabaseSubscription({
    channelName: `campaigns_${campaignId}_plugins`,
    table: 'campaign_plugins',
    filter: `campaign_id=eq.${campaignId}`,
    onChange: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await getCampaignPlugins(campaignId!);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: Boolean(campaignId),
  });
}
