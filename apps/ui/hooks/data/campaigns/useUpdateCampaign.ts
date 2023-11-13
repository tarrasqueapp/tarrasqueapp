import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { CampaignEntity } from '@tarrasque/sdk';

import { api } from '../../../lib/api';

/**
 * Send a request to update a campaign
 * @param campaign - The campaign to update
 * @returns The updated campaign
 */
async function updateCampaign(campaign: Partial<CampaignEntity>) {
  const { data } = await api.put<CampaignEntity>(`/api/campaigns/${campaign.id}`, campaign);
  return data;
}

/**
 * Update a campaign
 * @returns Campaign update mutation
 */
export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCampaign,
    // Optimistic update
    onMutate: async (campaign) => {
      await queryClient.cancelQueries({ queryKey: ['campaigns'] });
      const previousCampaigns = queryClient.getQueryData<CampaignEntity[]>(['campaigns']);
      queryClient.setQueryData(['campaigns'], (old: Partial<CampaignEntity>[] = []) =>
        old.map((c) => (c.id === campaign.id ? campaign : c)),
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
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}
