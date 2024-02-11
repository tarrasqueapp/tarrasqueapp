import { useQuery } from '@tanstack/react-query';

import { getMap } from '@/actions/maps';

/**
 * Get a map by ID
 * @param mapId - The id of the map to get
 * @returns Map query
 */
export function useGetMap(mapId: string) {
  return useQuery({
    queryKey: ['maps', mapId],
    queryFn: () => getMap(mapId),
    enabled: Boolean(mapId),
  });
}
