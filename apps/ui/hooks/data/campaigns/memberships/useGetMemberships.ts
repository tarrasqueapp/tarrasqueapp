import { useQuery } from '@tanstack/react-query';
import { RawAxiosRequestConfig } from 'axios';

import { MembershipEntity } from '@tarrasque/common';

import { api } from '../../../../lib/api';

/**
 * Send a request to get the campaigns's memberships
 * @param campaignId - The campaign to get memberships for
 * @param requestConfig - The request config
 * @returns The campaigns's memberships
 */
export async function getMemberships(campaignId: string, requestConfig?: RawAxiosRequestConfig) {
  const { data } = await api.get<MembershipEntity[]>(`/api/campaigns/${campaignId}/memberships`, requestConfig);
  return data;
}

/**
 * Get the campaign's memberships
 * @param campaignId - The campaign to get memberships for
 * @returns Memberships query
 */
export function useGetMemberships(campaignId: string | undefined) {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'memberships'],
    queryFn: () => getMemberships(campaignId!),
    enabled: Boolean(campaignId),
  });
}
