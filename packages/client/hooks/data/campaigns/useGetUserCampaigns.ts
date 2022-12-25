import { useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { CampaignInterface } from '../../../lib/types';

/**
 * Send a request to get the user's campaigns
 * @returns The user's campaigns
 */
async function getUserCampaigns() {
  const { data } = await api.get<CampaignInterface[]>(`/api/campaigns`);
  return data;
}

/**
 * Get the user's campaigns
 * @returns Campaigns query
 */
export function useGetUserCampaigns() {
  const queryClient = useQueryClient();

  return useQuery([`campaigns`], () => getUserCampaigns(), {
    enabled: Boolean(queryClient.getQueryData([`auth`])),
  });
}
