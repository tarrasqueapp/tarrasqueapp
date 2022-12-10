import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { MapInterface } from '../../../lib/types';

/**
 * Send a request to delete a map
 * @param map - The map to delete
 * @returns The deleted map
 */
async function deleteMap(map: MapInterface) {
  const { data } = await api.delete<MapInterface>(`/api/maps/${map.id}`, { data: { campaignId: map.campaignId } });
  return data;
}

/**
 * Delete a map
 * @returns Map delete mutation
 */
export function useDeleteMap() {
  const queryClient = useQueryClient();

  return useMutation(deleteMap, {
    onSuccess: (map) => {
      queryClient.invalidateQueries([`campaigns/${map.campaignId}/maps`]);
      queryClient.invalidateQueries([`maps`]);
    },
  });
}
