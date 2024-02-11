import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getUser } from '@/actions/auth';
import { getUserInvites } from '@/actions/invites';
import { useEffectAsync } from '@/hooks/useEffectAsync';
import { createBrowserClient } from '@/utils/supabase/client';

/**
 * Get the user's campaign invites
 * @returns User invites query
 */
export function useGetUserInvites() {
  const queryClient = useQueryClient();

  // Listen for changes to the setup and update the cache
  useEffectAsync(async () => {
    const supabase = createBrowserClient();
    const user = await getUser();
    const channel = supabase
      .channel(`user_${user!.id}_invites`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'campaign_invites' }, () => {
        queryClient.invalidateQueries({ queryKey: ['invites'] });
        queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return useQuery({
    queryKey: ['invites'],
    queryFn: () => getUserInvites(),
  });
}
