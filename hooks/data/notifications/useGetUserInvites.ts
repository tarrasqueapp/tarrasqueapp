import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getUserInvites } from '@/actions/invites';

import { useGetUser } from '../auth/useGetUser';
import { useSupabaseSubscription } from '../useSupabaseSubscription';

/**
 * Get the user's campaign invites
 * @returns User invites query
 */
export function useGetUserInvites() {
  const { data: user } = useGetUser();
  const queryClient = useQueryClient();

  const queryKey = ['user', 'invites'];

  useSupabaseSubscription({
    channelName: `user_invites`,
    table: 'campaign_invites',
    filter: `user_id=eq.${user?.id}`,
    onChange: (payload) => {
      // If the event is an insert or delete, invalidate the query
      if (
        payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT ||
        payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE
      ) {
        queryClient.invalidateQueries({ queryKey });
      }

      // If the event is a delete, remove the item from the cache
      if (payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE) {
        queryClient.setQueryData(queryKey, (data: { id: string }[]) => {
          if (!data) return data;
          return data.filter((item) => item.id !== payload.old.id);
        });

        // Also invalidate the campaigns query, as the user's campaigns may have changed
        queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      }
    },
  });

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await getUserInvites();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });
}
