import { useMutation, useQueryClient } from '@tanstack/react-query';

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
    onSuccess: () => {
      queryClient.invalidateQueries([`campaigns`]);
    },
  });
}
