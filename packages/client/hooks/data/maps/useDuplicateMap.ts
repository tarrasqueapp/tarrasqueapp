import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { MapInterface } from '../../../lib/types';

/**
 * Send a request to duplicate a map
 * @param map - The map to duplicate
 * @returns The duplicated map
 */
async function duplicateMap(map: MapInterface) {
  const { data } = await api.post<MapInterface>(`/api/maps/${map.id}/duplicate`);
  return data;
}

/**
 * Create a map
 * @returns Map duplicate mutation
 */
export function useDuplicateMap() {
  const queryClient = useQueryClient();

  return useMutation(duplicateMap, {
    onSuccess: (map) => {
      queryClient.invalidateQueries([`campaigns/${map.campaignId}/maps`]);
      queryClient.invalidateQueries([`maps`]);
    },
  });
}
