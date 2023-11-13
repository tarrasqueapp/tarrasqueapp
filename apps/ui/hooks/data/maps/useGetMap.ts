import { useQuery } from '@tanstack/react-query';

import { MapEntity } from '@tarrasque/sdk';

import { api } from '../../../lib/api';

/**
 * Send a request to get a map by id
 * @param mapId - The id of the map to get
 * @returns The map data
 */
async function getMap(mapId: string) {
  const { data } = await api.get<MapEntity>(`/api/maps/${mapId}`);
  return data;
}

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
