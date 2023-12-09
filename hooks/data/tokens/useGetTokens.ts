import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { TokenEntity } from '@/lib/types';

/**
 * Send a request to get a map's tokens
 * @param mapId - The map id to get tokens for
 * @returns The tokens
 */
async function getTokens(mapId: string | undefined) {
  const { data } = await api.get<TokenEntity[]>(`/api/maps/${mapId}/tokens`);
  return data;
}

/**
 * Get a map's tokens by the map ID
 * @param mapId - The map id to get tokens for
 * @returns Tokens query
 */
export function useGetTokens(mapId: string | undefined) {
  return useQuery({
    queryKey: ['maps', mapId, 'tokens'],
    queryFn: () => getTokens(mapId),
    enabled: Boolean(mapId),
  });
}
