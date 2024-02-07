import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getMemberships } from '@/actions/memberships';
import { createBrowserClient } from '@/utils/supabase/client';

/**
 * Get the campaign's memberships
 * @param campaignId - The campaign to get memberships for
 * @returns Memberships query
 */
export function useGetMemberships(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  // Listen for changes to the memberships and update the cache
  useEffect(() => {
    if (!campaignId) return;

    const supabase = createBrowserClient();
    const channel = supabase
      .channel(`campaign_${campaignId}_memberships`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'campaign_memberships' }, () => {
        queryClient.invalidateQueries({ queryKey: ['campaigns', campaignId, 'memberships'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  return useQuery({
    queryKey: ['campaigns', campaignId, 'memberships'],
    queryFn: () => getMemberships(campaignId!),
    enabled: Boolean(campaignId),
  });
}
