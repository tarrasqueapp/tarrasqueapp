import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { api } from '../../../lib/api';
import { CampaignInterface } from '../../../lib/types';

/**
 * Send a request to delete a campaign
 * @param campaign - The campaign to delete
 * @returns The deleted campaign
 */
async function deleteCampaign(campaign: CampaignInterface) {
  const { data } = await api.delete<CampaignInterface>(`/api/campaigns/${campaign.id}`);
  return data;
}

/**
 * Delete a campaign
 * @returns Campaign delete mutation
 */
export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation(deleteCampaign, {
    // Optimistic update
    onMutate: async (campaign) => {
      await queryClient.cancelQueries([`campaigns`]);
      const previousCampaigns = queryClient.getQueryData<CampaignInterface[]>([`campaigns`]);
      queryClient.setQueryData([`campaigns`], (old: CampaignInterface[] = []) =>
        old.filter((c) => c.id !== campaign.id),
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
