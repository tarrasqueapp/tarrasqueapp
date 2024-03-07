import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getCampaign } from '@/actions/campaigns';
import { createBrowserClient } from '@/utils/supabase/client';

/**
 * Get a campaign by ID
 * @param campaignId - The id of the campaign to get
 * @returns Campaign query
 */
export function useGetCampaign(campaignId: string) {
  const queryClient = useQueryClient();

  // Listen for changes to the campaign and update the cache
  useEffect(() => {
    if (!campaignId) return;

    let supabase: SupabaseClient;
    let channel: RealtimeChannel;

    requestAnimationFrame(() => {
      supabase = createBrowserClient();
      channel = supabase
        .channel(`campaigns_${campaignId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, async (payload) => {
          queryClient.setQueryData(['campaigns', campaignId], payload.new);
        })
        .subscribe();
    });

    return () => {
      if (!supabase || !channel) return;
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  return useQuery({
    queryKey: ['campaigns', campaignId],
    queryFn: () => getCampaign(campaignId),
    enabled: Boolean(campaignId),
  });
}
