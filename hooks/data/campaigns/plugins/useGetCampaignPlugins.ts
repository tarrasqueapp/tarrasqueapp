import { useQuery } from '@tanstack/react-query';
import { RawAxiosRequestConfig } from 'axios';

import { api } from '../../../../lib/api';
import { PluginEntity } from '../../../../lib/types';

/**
 * Send a request to get the campaign's plugins
 * @param campaignId - The campaign to get plugins for
 * @param requestConfig - The request config
 * @returns The campaign's plugins
 */
export async function getCampaignPlugins(campaignId: string, requestConfig?: RawAxiosRequestConfig) {
  const { data } = await api.get<PluginEntity[]>(`/api/campaigns/${campaignId}/plugins`, requestConfig);
  return data;
}

/**
 * Get the campaign's plugins
 * @param campaignId - The campaign to get plugins for
 * @returns Campaign plugins query
 */
export function useGetCampaignPlugins(campaignId: string | undefined) {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'plugins'],
    queryFn: () => getCampaignPlugins(campaignId!),
    enabled: Boolean(campaignId),
  });
}
