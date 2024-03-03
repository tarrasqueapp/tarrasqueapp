import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getUserInvites } from '@/actions/invites';
import { createBrowserClient } from '@/utils/supabase/client';

import { useGetUser } from '../auth/useGetUser';

/**
 * Get the user's campaign invites
 * @returns User invites query
 */
export function useGetUserInvites() {
  const { data: user } = useGetUser();
  const queryClient = useQueryClient();

  // Listen for changes to the user and update the cache
  useEffect(() => {
    if (!user) return;

    let supabase: SupabaseClient;
    let channel: RealtimeChannel;

    requestAnimationFrame(async () => {
      supabase = createBrowserClient();
      channel = supabase
        .channel(`user_${user.id}_invites`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'campaign_invites' }, () => {
          queryClient.invalidateQueries({ queryKey: ['invites'] });
          queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        })
        .subscribe();
    });

    return () => {
      supabase?.removeChannel(channel);
    };
  }, [user]);

  return useQuery({
    queryKey: ['invites'],
    queryFn: () => getUserInvites(),
  });
}
