import { useQuery } from '@tanstack/react-query';

/**
 * Get a map's tokens by the map ID
 * @param mapId - The map id to get tokens for
 * @returns Tokens query
 */
export function useGetTokens(mapId: string | undefined) {
  return useQuery({
    queryKey: ['maps', mapId, 'tokens'],
    queryFn: () => [],
    enabled: Boolean(mapId),
  });
}
