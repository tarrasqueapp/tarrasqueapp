import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { api } from '../../../lib/api';
import { CampaignInterface } from '../../../lib/types';

/**
 * Send a request to create a campaign
 * @param campaign - The campaign to create
 * @returns The created campaign
 */
async function createCampaign(campaign: Partial<CampaignInterface>) {
  const { data } = await api.post<CampaignInterface>(`/api/campaigns`, campaign);
  return data;
}

/**
 * Create a campaign
 * @returns Campaign create mutation
 */
export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation(createCampaign, {
    // Optimistic update
    onMutate: async (campaign) => {
      await queryClient.cancelQueries([`campaigns`]);
      const previousCampaigns = queryClient.getQueryData<CampaignInterface[]>([`campaigns`]);
      const id = Math.random().toString(36).substring(2, 9);
      queryClient.setQueryData([`campaigns`], (old: Partial<CampaignInterface>[] = []) => [
        ...old,
        { id, ...campaign },
      ]);
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
      queryClient.setQueryData([`campaigns/${campaign?.id}/maps`], []);
    },
  });
}
