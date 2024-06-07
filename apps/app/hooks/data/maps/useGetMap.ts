import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getMap } from '@/actions/maps';

import { useSupabaseSubscription } from '../useSupabaseSubscription';

/**
 * Get a map by ID
 * @param mapId - The id of the map to get
 * @returns Map query
 */
export function useGetMap(mapId: string | undefined) {
  const queryClient = useQueryClient();

  const queryKey = ['maps', mapId];

  useSupabaseSubscription({
    channelName: `maps_${mapId}`,
    table: 'maps',
    filter: `id=eq.${mapId}`,
    onChange: (payload) => {
      // If the event is an insert or update, invalidate the query
      if (
        payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT ||
        payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE
      ) {
        queryClient.invalidateQueries({ queryKey });
      }

      // If the event is a delete, remove the item from the cache
      if (payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE) {
        queryClient.setQueryData(queryKey, undefined);
      }
    },
  });

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await getMap(mapId!);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: Boolean(mapId),
  });
}
