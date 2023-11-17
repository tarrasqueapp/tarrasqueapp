import { useQuery } from '@tanstack/react-query';
import { RawAxiosRequestConfig } from 'axios';

import { MapEntity } from '@tarrasque/sdk';

import { api } from '../../../lib/api';

/**
 * Send a request to get a campaign's maps
 * @param campaignId - The ID of the campaign to fetch maps for
 * @param requestConfig - Axios request config
 * @returns The campaign's maps
 */
export async function getCampaignMaps(campaignId?: string, requestConfig?: RawAxiosRequestConfig) {
  const { data } = await api.get<MapEntity[]>(`/api/campaigns/${campaignId}/maps`, requestConfig);
  return data;
}

/**
 * Get the campaign's maps
 * @param campaignId - The ID of the campaign to get maps for
 * @returns Campaign maps query
 */
export function useGetCampaignMaps(campaignId?: string) {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'maps'],
    queryFn: () => getCampaignMaps(campaignId),
    enabled: Boolean(campaignId),
  });
}
