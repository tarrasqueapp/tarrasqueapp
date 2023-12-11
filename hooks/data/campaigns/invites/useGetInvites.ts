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

    const supabase = createBrowserClient();
    const channel = supabase
      .channel(`campaign_${campaignId}_invites`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invites' }, async () => {
        queryClient.invalidateQueries({ queryKey: ['campaigns', campaignId, 'invites'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  return useQuery({
    queryKey: ['campaigns', campaignId, 'invites'],
    queryFn: () => getInvites(campaignId!),
    enabled: Boolean(campaignId),
  });
}
