import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getCampaignPlugins } from '@/actions/plugins';
import { createBrowserClient } from '@/utils/supabase/client';

/**
 * Get the campaign's plugins
 * @param campaignId - The campaign to get plugins for
 * @returns Campaign plugins query
 */
export function useGetCampaignPlugins(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  // Listen for changes to the plugins and update the cache
  useEffect(() => {
    let supabase: SupabaseClient;
    let channel: RealtimeChannel;

    requestAnimationFrame(() => {
      supabase = createBrowserClient();
      channel = supabase
        .channel(`campaigns_${campaignId}_plugins`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'campaign_plugins' }, () => {
          queryClient.invalidateQueries({ queryKey: ['campaigns', campaignId, 'plugins'] });
        })
        .subscribe();
    });

    return () => {
      supabase?.removeChannel(channel);
    };
  }, [campaignId]);

  return useQuery({
    queryKey: ['campaigns', campaignId, 'plugins'],
    queryFn: () => getCampaignPlugins(campaignId!),
    enabled: Boolean(campaignId),
  });
}
