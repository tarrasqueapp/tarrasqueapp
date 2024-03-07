import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getUser } from '@/actions/auth';
import { CampaignMemberRole } from '@/actions/memberships';
import { getUserPlugins } from '@/actions/plugins';
import { createBrowserClient } from '@/utils/supabase/client';

/**
 * Get the user's plugins
 * @returns Plugins query
 */
export function useGetUserPlugins(role?: CampaignMemberRole) {
  const queryClient = useQueryClient();

  // Listen for changes to the plugins and update the cache
  useEffect(() => {
    let supabase: SupabaseClient;
    let channel: RealtimeChannel;

    requestAnimationFrame(async () => {
      supabase = createBrowserClient();
      const user = await getUser();
      channel = supabase
        .channel(`user_${user!.id}_plugins`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'plugins' }, () => {
          queryClient.invalidateQueries({ queryKey: ['user', 'plugins'] });
        })
        .subscribe();
    });

    return () => {
      if (!supabase || !channel) return;
      supabase.removeChannel(channel);
    };
  }, [role]);

  return useQuery({
    queryKey: ['user', 'plugins'],
    queryFn: () => getUserPlugins(),
  });
}
