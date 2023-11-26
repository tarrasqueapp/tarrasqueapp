import { useQuery } from '@tanstack/react-query';
import { RawAxiosRequestConfig } from 'axios';

import { ActionTokenEntity, ActionTokenType } from '@tarrasque/common';

import { api } from '../../../lib/api';

/**
 * Send a request to get an action token by id
 * @param tokenId - The ID of the token to fetch
 * @param type - The type of token to fetch
 * @param requestConfig - The request config
 * @returns The token data
 */
export async function getActionToken(tokenId: string, type?: ActionTokenType, requestConfig?: RawAxiosRequestConfig) {
  const { data } = await api.get<ActionTokenEntity>(`/api/action-tokens/${tokenId}`, {
    params: { type },
    ...requestConfig,
  });
  return data;
}

/**
 * Get a token by ID
 * @param tokenId - The ID of the token to get
 * @returns Action token query
 */
export function useGetToken(tokenId: string) {
  return useQuery({
    queryKey: ['action-tokens', tokenId],
    queryFn: () => getActionToken(tokenId),
    enabled: Boolean(tokenId),
  });
}
