import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getCampaign } from '@/actions/campaigns';

import { useSupabaseSubscription } from '../useSupabaseSubscription';

/**
 * Get a campaign by ID
 * @param campaignId - The id of the campaign to get
 * @returns Campaign query
 */
export function useGetCampaign(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  const queryKey = ['campaigns', campaignId];

  useSupabaseSubscription({
    channelName: `campaigns_${campaignId}`,
    table: 'campaigns',
    filter: `id=eq.${campaignId}`,
    onChange: (payload) => {
      queryClient.setQueryData(queryKey, payload.new);
    },
  });

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await getCampaign(campaignId!);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: Boolean(campaignId),
  });
}
