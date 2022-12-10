import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { MapInterface } from '../../../lib/types';

/**
 * Send a request to create a map
 * @param map - The map to create
 * @returns The created map
 */
async function createMap(map: Partial<MapInterface>) {
  const { data } = await api.post<MapInterface>(`/api/maps`, map);
  return data;
}

/**
 * Create a map
 * @returns Map create mutation
 */
export function useCreateMap() {
  const queryClient = useQueryClient();

  return useMutation(createMap, {
    onSuccess: (map) => {
      queryClient.invalidateQueries([`campaigns/${map.campaignId}/maps`]);
      queryClient.invalidateQueries([`maps`]);
    },
  });
}
