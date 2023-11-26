import { useQuery } from '@tanstack/react-query';
import { RawAxiosRequestConfig } from 'axios';

import { CampaignEntity } from '@tarrasque/common';

import { api } from '../../../lib/api';

/**
 * Send a request to get the user's campaigns
 * @param requestConfig - Axios request config
 * @returns The user's campaigns
 */
export async function getUserCampaigns(requestConfig?: RawAxiosRequestConfig) {
  const { data } = await api.get<CampaignEntity[]>(`/api/campaigns`, requestConfig);
  return data;
}

/**
 * Get the user's campaigns
 * @returns Campaigns query
 */
export function useGetUserCampaigns() {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: () => getUserCampaigns(),
  });
}
