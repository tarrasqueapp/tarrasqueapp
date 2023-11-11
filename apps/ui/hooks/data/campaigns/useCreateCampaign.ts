import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { api } from '../../../lib/api';
import { CampaignEntity, UserEntity } from '../../../lib/types';

/**
 * Send a request to create a campaign
 * @param campaign - The campaign to create
 * @returns The created campaign
 */
async function createCampaign(campaign: Partial<CampaignEntity>) {
  const { data } = await api.post<CampaignEntity>(`/api/campaigns`, campaign);
  return data;
}

/**
 * Create a campaign
 * @returns Campaign create mutation
 */
export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCampaign,
    // Optimistic update
    onMutate: async (campaign) => {
      await queryClient.cancelQueries({ queryKey: ['campaigns'] });
      const previousCampaigns = queryClient.getQueryData<CampaignEntity[]>(['campaigns']);
      const user = queryClient.getQueryData<UserEntity>(['auth']);
      const id = Math.random().toString(36).substring(2, 9);
      queryClient.setQueryData(['campaigns'], (old: Partial<CampaignEntity>[] = []) => [
        ...old,
        { id, ...campaign, createdById: user?.id, members: [] },
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
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.setQueryData(['campaigns', campaign?.id, 'maps'], []);
    },
  });
}
