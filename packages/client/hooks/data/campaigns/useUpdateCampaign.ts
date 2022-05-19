import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../../lib/api';
import { CampaignInterface } from '../../../lib/types';

/**
 * Send a request to update a campaign
 * @param campaign - The campaign to update
 * @returns The updated campaign
 */
async function updateCampaign(campaign: Partial<CampaignInterface>) {
  const { data } = await api.put<CampaignInterface>(`/api/campaigns/${campaign.id}`, campaign);
  return data;
}

/**
 * Update a campaign
 * @returns Campaign update mutation
 */
export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation(updateCampaign, {
    onSuccess: (campaign) => {
      queryClient.invalidateQueries(`campaigns`);
      queryClient.invalidateQueries(`campaigns/${campaign.id}`);
    },
  });
}
