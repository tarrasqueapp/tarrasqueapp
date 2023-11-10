import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { MapEntity } from '../../../lib/types';

/**
 * Send a request to duplicate a map
 * @param map - The map to duplicate
 * @returns The duplicated map
 */
async function duplicateMap(map: MapEntity) {
  const { data } = await api.post<MapEntity>(`/api/maps/${map.id}/duplicate`);
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
    },
  });
}
