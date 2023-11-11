import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { MapEntity } from '../../../lib/types';

/**
 * Send a request to update a map
 * @param map - The map to update
 * @returns The updated map
 */
async function updateMap(map: Partial<MapEntity>) {
  const { data } = await api.put<MapEntity>(`/api/maps/${map.id}`, map);
  return data;
}

/**
 * Update a map
 * @returns Map update mutation
 */
export function useUpdateMap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMap,
    onSuccess: (map) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', map.campaignId, 'maps'] });
    },
  });
}
