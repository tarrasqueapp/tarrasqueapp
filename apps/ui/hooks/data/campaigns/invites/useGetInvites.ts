import { useQuery } from '@tanstack/react-query';
import { RawAxiosRequestConfig } from 'axios';

import { ActionTokenEntity } from '@tarrasque/common';

import { api } from '../../../../lib/api';

/**
 * Send a request to get the campaign's invites
 * @param campaignId - The campaign to get invites for
 * @param requestConfig - The request config
 * @returns The campaign's invites
 */
export async function getInvites(campaignId: string, requestConfig?: RawAxiosRequestConfig) {
  const { data } = await api.get<ActionTokenEntity[]>(`/api/campaigns/${campaignId}/invites`, requestConfig);
  return data;
}

/**
 * Get the campaign's invites
 * @param campaignId - The campaign to get invites for
 * @returns Invites query
 */
export function useGetInvites(campaignId: string | undefined) {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'invites'],
    queryFn: () => getInvites(campaignId!),
    enabled: Boolean(campaignId),
  });
}
