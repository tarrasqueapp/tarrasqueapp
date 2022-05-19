import { useQuery } from 'react-query';

import { api } from '../../../lib/api';
import { CampaignInterface } from '../../../lib/types';

/**
 * Send a request to get a campaign's maps
 * @param campaignId - The ID of the campaign to fetch maps for
 * @returns The campaign's maps
 */
async function getCampaignMaps(campaignId: string) {
  const { data } = await api.get<CampaignInterface[]>(`/api/campaigns/${campaignId}/maps`);
  return data;
}

/**
 * Get the campaign's maps
 * @param campaignId - The id of the campaign to get maps for
 * @returns Campaign maps query
 */
export function useGetCampaignMaps(campaignId: string) {
  return useQuery(`campaigns/${campaignId}/maps`, () => getCampaignMaps(campaignId), { enabled: Boolean(campaignId) });
}
