import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { MapInterface } from '../../../lib/types';

/**
 * Send a request to update a map
 * @param map - The map to update
 * @returns The updated map
 */
async function updateMap(map: Partial<MapInterface>) {
  const { data } = await api.put<MapInterface>(`/api/maps/${map.id}`, map);
  return data;
}

/**
 * Update a map
 * @returns Map update mutation
 */
export function useUpdateMap() {
  const queryClient = useQueryClient();

  return useMutation(updateMap, {
    onSuccess: (map) => {
      queryClient.invalidateQueries([`campaigns/${map.campaignId}/maps`]);
    },
  });
}
