import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getMapGrid } from '@/actions/grids';
import { createBrowserClient } from '@/utils/supabase/client';

/**
 * Get a map's grid by the map ID
 * @param mapId - The map id to get grid for
 * @returns Grid query
 */
export function useGetGrid(mapId: string | undefined) {
  const queryClient = useQueryClient();

  // Listen for changes to the map grid and update the cache
  useEffect(() => {
    if (!mapId) return;

    let supabase: SupabaseClient;
    let channel: RealtimeChannel;

    requestAnimationFrame(() => {
      supabase = createBrowserClient();
      channel = supabase
        .channel(`maps_${mapId}_grid`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'grids' }, async () => {
          queryClient.invalidateQueries({ queryKey: ['maps', mapId, 'grid'] });
        })
        .subscribe();
    });

    return () => {
      if (!supabase || !channel) return;
      supabase.removeChannel(channel);
    };
  }, [mapId]);

  return useQuery({
    queryKey: ['maps', mapId, 'grid'],
    queryFn: () => getMapGrid(mapId!),
    enabled: Boolean(mapId),
  });
}
