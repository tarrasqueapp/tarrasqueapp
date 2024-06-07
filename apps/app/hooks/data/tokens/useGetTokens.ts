import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getMapTokens } from '@/actions/tokens';

import { useSupabaseSubscription } from '../useSupabaseSubscription';

/**
 * Get a map's tokens by the map ID
 * @param mapId - The map id to get tokens for
 * @returns Tokens query
 */
export function useGetTokens(mapId: string | undefined) {
  const queryClient = useQueryClient();

  const queryKey = ['maps', mapId, 'tokens'];

  useSupabaseSubscription({
    channelName: `maps_${mapId}_tokens`,
    table: 'tokens',
    filter: `map_id=eq.${mapId}`,
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
        queryClient.setQueryData(queryKey, (data: { id: string }[]) => {
          if (!data) return data;
          return data.filter((item) => item.id !== payload.old.id);
        });
      }
    },
  });

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await getMapTokens(mapId!);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: Boolean(mapId),
  });
}
