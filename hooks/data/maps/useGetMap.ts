import { useQuery } from '@tanstack/react-query';
import { RawAxiosRequestConfig } from 'axios';

import { api } from '../../../lib/api';
import { MapEntity } from '../../../lib/types';

/**
 * Send a request to get a map by id
 * @param mapId - The id of the map to get
 * @returns The map data
 */
export async function getMap(mapId: string, requestConfig?: RawAxiosRequestConfig) {
  const { data } = await api.get<MapEntity>(`/api/maps/${mapId}`, requestConfig);
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
