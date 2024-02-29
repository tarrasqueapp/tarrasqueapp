import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getUser } from '@/actions/auth';
import { getUserCampaigns } from '@/actions/campaigns';
import { CampaignMemberRole } from '@/actions/memberships';
import { createBrowserClient } from '@/utils/supabase/client';

/**
 * Get the user's campaigns
 * @returns Campaigns query
 */
export function useGetUserCampaigns(role?: CampaignMemberRole) {
  const queryClient = useQueryClient();

  // Listen for changes to the campaigns and update the cache
  useEffect(() => {
    let supabase: SupabaseClient;
    let channel: RealtimeChannel;

    requestAnimationFrame(async () => {
      supabase = createBrowserClient();
      const user = await getUser();
      channel = supabase
        .channel(`user_${user!.id}_campaigns`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, () => {
          queryClient.invalidateQueries({ queryKey: ['campaigns', { role }] });
        })
        .subscribe();
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [role]);

  return useQuery({
    queryKey: ['campaigns', { role }],
    queryFn: () => getUserCampaigns(role),
  });
}
