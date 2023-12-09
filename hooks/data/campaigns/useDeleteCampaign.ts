import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { api } from '@/lib/api';
import { CampaignEntity } from '@/lib/types';

/**
 * Send a request to delete a campaign
 * @param campaign - The campaign to delete
 * @returns The deleted campaign
 */
async function deleteCampaign(campaign: CampaignEntity) {
  const { data } = await api.delete<CampaignEntity>(`/api/campaigns/${campaign.id}`);
  return data;
}

/**
 * Delete a campaign
 * @returns Campaign delete mutation
 */
export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCampaign,
    // Optimistic update
    onMutate: async (campaign) => {
      await queryClient.cancelQueries({ queryKey: ['campaigns'] });
      const previousCampaigns = queryClient.getQueryData<CampaignEntity[]>(['campaigns']);
      queryClient.setQueryData(['campaigns'], (old: CampaignEntity[] = []) => old.filter((c) => c.id !== campaign.id));
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
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}
