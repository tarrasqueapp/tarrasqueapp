import { useQuery } from '@tanstack/react-query';

import { CampaignEntity } from '@tarrasque/sdk';

import { api } from '../../../lib/api';

/**
 * Send a request to get the user's campaigns
 * @returns The user's campaigns
 */
async function getUserCampaigns() {
  const { data } = await api.get<CampaignEntity[]>(`/api/campaigns`);
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
