import { useMutation, useQueryClient } from 'react-query';

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
    onSuccess: (campaign) => {
      queryClient.invalidateQueries(`campaigns`);
      queryClient.invalidateQueries(`campaigns/${campaign.id}`);
    },
  });
}
