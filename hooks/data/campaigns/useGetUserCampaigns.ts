import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getUserCampaigns } from '@/actions/campaigns';
import { CampaignMemberRole } from '@/actions/memberships';
import { createBrowserClient } from '@/utils/supabase/client';

import { useGetUser } from '../auth/useGetUser';

/**
 * Get the user's campaigns
 * @returns Campaigns query
 */
export function useGetUserCampaigns(role?: CampaignMemberRole) {
  const { data: user } = useGetUser();
  const queryClient = useQueryClient();

  // Listen for changes to the campaigns and update the cache
  useEffect(() => {
    if (!user) return;

    let supabase: SupabaseClient;
    let channel: RealtimeChannel;

    requestAnimationFrame(async () => {
      supabase = createBrowserClient();
      channel = supabase
        .channel(`user_${user.id}_campaigns_${role}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, () => {
          queryClient.invalidateQueries({ queryKey: ['campaigns', { role }] });
        })
        .subscribe();
    });

    return () => {
      if (!supabase || !channel) return;
      supabase.removeChannel(channel);
    };
  }, [role, user]);

  return useQuery({
    queryKey: ['campaigns', { role }],
    queryFn: async () => {
      const response = await getUserCampaigns(role);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });
}
