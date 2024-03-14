import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getMapTokens } from '@/actions/tokens';
import { createBrowserClient } from '@/utils/supabase/client';

/**
 * Get a map's tokens by the map ID
 * @param mapId - The map id to get tokens for
 * @returns Tokens query
 */
export function useGetTokens(mapId: string | undefined) {
  const queryClient = useQueryClient();

  // Listen for changes to the map tokens and update the cache
  useEffect(() => {
    if (!mapId) return;

    let supabase: SupabaseClient;
    let channel: RealtimeChannel;

    requestAnimationFrame(() => {
      supabase = createBrowserClient();
      channel = supabase
        .channel(`maps_${mapId}_tokens`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tokens' }, async () => {
          queryClient.invalidateQueries({ queryKey: ['maps', mapId, 'tokens'] });
        })
        .subscribe();
    });

    return () => {
      if (!supabase || !channel) return;
      supabase.removeChannel(channel);
    };
  }, [mapId]);

  return useQuery({
    queryKey: ['maps', mapId, 'tokens'],
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
