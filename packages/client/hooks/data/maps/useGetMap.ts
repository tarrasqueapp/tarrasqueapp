import { useQuery } from 'react-query';

import { api } from '../../../lib/api';
import { MapInterface } from '../../../lib/types';

/**
 * Send a request to get a map by id
 * @param mapId - The id of the map to get
 * @returns The map data
 */
async function getMap(mapId: string) {
  const { data } = await api.get<MapInterface>(`/api/maps/${mapId}`);
  return data;
}

/**
 * Get a map by ID
 * @param mapId - The id of the map to get
 * @returns Map query
 */
export function useGetMap(mapId: string) {
  return useQuery(`maps/${mapId}`, () => getMap(mapId), { enabled: Boolean(mapId) });
}
