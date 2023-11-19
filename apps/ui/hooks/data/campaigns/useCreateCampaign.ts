import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { CampaignEntity } from '@tarrasque/sdk';

import { api } from '../../../lib/api';

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
    onSettled: (campaign, err: Error | null) => {
      if (err) {
        toast.error(err.message);
      }
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.setQueryData(['campaigns', campaign?.id, 'maps'], []);
    },
  });
}
