import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getUserPlugins } from '@/actions/plugins';

import { useGetUser } from '../auth/useGetUser';
import { useSupabaseSubscription } from '../useSupabaseSubscription';

/**
 * Get the user's plugins
 * @returns Plugins query
 */
export function useGetUserPlugins() {
  const { data: user } = useGetUser();
  const queryClient = useQueryClient();

  const queryKey = ['user', 'plugins'];

  useSupabaseSubscription({
    channelName: `user_plugins`,
    table: 'plugins',
    filter: `user_id=eq.${user?.id}`,
    onChange: (payload) => {
      // If the event is an insert, add the new item to the cache
      if (payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT) {
        queryClient.setQueryData(queryKey, (data: { id: string }[]) => {
          if (!data) return data;
          return [...data, payload.new];
        });
      }

      // If the event is an update, update the item in the cache
      if (payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE) {
        queryClient.setQueryData(queryKey, (data: { id: string }[]) => {
          if (!data) return data;
          return data.map((item) => (item.id === payload.new.id ? payload.new : item));
        });
      }

      // If the event is a delete, remove the item from the cache
      if (payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE) {
        queryClient.setQueryData(queryKey, (data: { id: string }[]) => {
          if (!data) return data;
          return data.filter((item) => item.id !== payload.old.id);
        });
      }
    },
  });

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await getUserPlugins();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });
}
