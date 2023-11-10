import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { api } from '../../../lib/api';
import { CampaignEntity } from '../../../lib/types';

/**
 * Send a request to reorder campaigns
 * @param campaignIds - The new order of campaign ids
 * @returns The reordered campaigns
 */
async function reorderCampaigns(campaignIds: string[]) {
  const { data } = await api.post<CampaignEntity>(`/api/campaigns/reorder`, { campaignIds });
  return data;
}

/**
 * Reorder campaigns
 * @returns Campaigns reorder mutation
 */
export function useReorderCampaigns() {
  const queryClient = useQueryClient();

  return useMutation(reorderCampaigns, {
    // Optimistic update
    onMutate: async (campaignOrder) => {
      await queryClient.cancelQueries([`campaigns`]);
      const previousCampaigns = queryClient.getQueryData<CampaignEntity[]>([`campaigns`]);
      // Sort the campaigns based on the user's campaign order
      queryClient.setQueryData([`campaigns`], (campaigns: CampaignEntity[] = []) =>
        campaigns.sort((a, b) => {
          const aOrder = campaignOrder.findIndex((campaignId) => campaignId === a.id);
          const bOrder = campaignOrder.findIndex((campaignId) => campaignId === b.id);
          // If the user has no campaign order or the campaign is not in the order, sort by creation date
          if (aOrder === -1 || bOrder === -1) {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          }
          // Sort by the user's campaign order
          return aOrder - bOrder;
        }),
      );
      return { previousCampaigns };
    },
    // Rollback
    onError: (err, campaign, context) => {
      queryClient.setQueryData(['campaigns'], context?.previousCampaigns);
    },
    // Refetch
    onSettled: (campaign, err: Error | null) => {
      if (err) {
        toast.error(err.message);
      }
      queryClient.invalidateQueries([`campaigns`]);
    },
  });
}
