import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getMap } from '@/actions/maps';
import { createBrowserClient } from '@/utils/supabase/client';

/**
 * Get a map by ID
 * @param mapId - The id of the map to get
 * @returns Map query
 */
export function useGetMap(mapId: string) {
  const queryClient = useQueryClient();

  // Listen for changes to the map and update the cache
  useEffect(() => {
    if (!mapId) return;

    let supabase: SupabaseClient;
    let channel: RealtimeChannel;

    requestAnimationFrame(() => {
      supabase = createBrowserClient();
      channel = supabase
        .channel(`map_${mapId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'maps' }, async () => {
          queryClient.invalidateQueries({ queryKey: ['maps', mapId] });
        })
        .subscribe();
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mapId]);

  return useQuery({
    queryKey: ['maps', mapId],
    queryFn: () => getMap(mapId),
    enabled: Boolean(mapId),
  });
}
