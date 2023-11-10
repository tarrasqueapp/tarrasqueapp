import { useQuery } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { CampaignEntity } from '../../../lib/types';

/**
 * Send a request to get a campaign by id
 * @param campaignId - The ID of the campaign to fetch
 * @returns The campaign data
 */
async function getCampaign(campaignId: string) {
  const { data } = await api.get<CampaignEntity>(`/api/campaigns/${campaignId}`);
  return data;
}

/**
 * Get a campaign by ID
 * @param campaignId - The ID of the campaign to get
 * @returns Campaign query
 */
export function useGetCampaign(campaignId: string) {
  return useQuery([`campaigns/${campaignId}`], () => getCampaign(campaignId), { enabled: Boolean(campaignId) });
}
