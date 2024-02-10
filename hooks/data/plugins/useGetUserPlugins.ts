import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getUser } from '@/actions/auth';
import { CampaignMemberRole } from '@/actions/memberships';
import { getUserPlugins } from '@/actions/plugins';
import { useEffectAsync } from '@/hooks/useEffectAsync';
import { createBrowserClient } from '@/utils/supabase/client';

/**
 * Get the user's plugins
 * @returns Plugins query
 */
export function useGetUserPlugins(role?: CampaignMemberRole) {
  const queryClient = useQueryClient();

  // Listen for changes to the plugins and update the cache
  useEffectAsync(async () => {
    const supabase = createBrowserClient();
    const user = await getUser();
    const channel = supabase
      .channel(`user_${user!.id}_plugins`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'plugins' }, () => {
        queryClient.invalidateQueries({ queryKey: ['user', 'plugins'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [role]);

  return useQuery({
    queryKey: ['user', 'plugins'],
    queryFn: () => getUserPlugins(),
  });
}
