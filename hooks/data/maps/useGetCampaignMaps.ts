import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getMaps } from '@/actions/maps';
import { createBrowserClient } from '@/utils/supabase/client';

/**
 * Get the campaign's maps
 * @param campaignId - The ID of the campaign to get maps for
 * @returns Campaign maps query
 */
export function useGetCampaignMaps(campaignId?: string) {
  const queryClient = useQueryClient();

  // Listen for changes to the maps and update the cache
  useEffect(() => {
    if (!campaignId) return;

    let supabase: SupabaseClient;
    let channel: RealtimeChannel;

    requestAnimationFrame(() => {
      supabase = createBrowserClient();
      channel = supabase
        .channel(`campaign_${campaignId}_maps`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'maps' }, () => {
          queryClient.invalidateQueries({ queryKey: ['campaigns', campaignId, 'maps'] });
        })
        .subscribe();
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  return useQuery({
    queryKey: ['campaigns', campaignId, 'maps'],
    queryFn: () => getMaps(campaignId!),
    enabled: Boolean(campaignId),
  });
}
