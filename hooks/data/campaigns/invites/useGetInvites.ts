import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getInvites } from '@/actions/invites';
import { createBrowserClient } from '@/utils/supabase/client';

/**
 * Get the campaign's invites
 * @param campaignId - The campaign to get invites for
 * @returns Invites query
 */
export function useGetInvites(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  // Listen for changes to the invites and update the cache
  useEffect(() => {
    if (!campaignId) return;

    let supabase: SupabaseClient;
    let channel: RealtimeChannel;

    requestAnimationFrame(() => {
      supabase = createBrowserClient();
      channel = supabase
        .channel(`campaigns_${campaignId}_invites`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'campaign_invites' }, async () => {
          queryClient.invalidateQueries({ queryKey: ['campaigns', campaignId, 'invites'] });
        })
        .subscribe();
    });

    return () => {
      if (!supabase || !channel) return;
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  return useQuery({
    queryKey: ['campaigns', campaignId, 'invites'],
    queryFn: async () => {
      const response = await getInvites(campaignId!);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: Boolean(campaignId),
  });
}
