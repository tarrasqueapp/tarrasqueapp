import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MapEntity } from '@tarrasque/sdk';

import { api } from '../../../lib/api';

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

  return useMutation({
    mutationFn: duplicateMap,
    onSuccess: (map) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', map.campaignId, 'maps'] });
    },
  });
}
