import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getMapGrid } from '@/actions/grids';

import { useSupabaseSubscription } from '../useSupabaseSubscription';

/**
 * Get a map's grid by the map ID
 * @param mapId - The map id to get grid for
 * @returns Grid query
 */
export function useGetGrid(mapId: string | undefined) {
  const queryClient = useQueryClient();

  const queryKey = ['maps', mapId, 'grid'];

  useSupabaseSubscription({
    channelName: `maps_${mapId}_grid`,
    table: 'grids',
    filter: `map_id=eq.${mapId}`,
    onChange: (payload) => {
      queryClient.setQueryData(queryKey, payload.new);
    },
  });

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await getMapGrid(mapId!);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: Boolean(mapId),
  });
}
