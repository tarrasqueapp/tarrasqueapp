import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { MapEntity } from '@/lib/types';

/**
 * Send a request to create a map
 * @param map - The map to create
 * @returns The created map
 */
async function createMap(map: Partial<MapEntity>) {
  const { data } = await api.post<MapEntity>(`/api/maps`, map);
  return data;
}

/**
 * Create a map
 * @returns Map create mutation
 */
export function useCreateMap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMap,
    onSuccess: (map) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', map.campaignId, 'maps'] });
    },
  });
}
