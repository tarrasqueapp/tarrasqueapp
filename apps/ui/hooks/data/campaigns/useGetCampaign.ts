import { useQuery } from '@tanstack/react-query';

import { CampaignEntity } from '@tarrasque/common';

import { api } from '../../../lib/api';

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
  return useQuery({
    queryKey: ['campaigns', campaignId],
    queryFn: () => getCampaign(campaignId),
    enabled: Boolean(campaignId),
  });
}
