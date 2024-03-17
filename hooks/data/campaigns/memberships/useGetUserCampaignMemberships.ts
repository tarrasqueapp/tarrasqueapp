import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { getUserCampaignMemberships } from '@/actions/memberships';
import { validation } from '@/lib/validation';

import { useGetUser } from '../../auth/useGetUser';
import { useSupabaseSubscription } from '../../useSupabaseSubscription';

/**
 * Get the user's campaign memberships
 * @returns Campaign memberships query
 */
export function useGetUserCampaignMemberships({
  role,
}: z.infer<typeof validation.schemas.memberships.getUserCampaignMemberships>) {
  const { data: user } = useGetUser();
  const queryClient = useQueryClient();

  const queryKey = ['user', 'campaign_memberships', { role }];

  useSupabaseSubscription({
    channelName: `user_campaign_memberships_${role}`,
    table: 'campaign_memberships',
    filter: `user_id.eq.${user?.id}`,
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
      const response = await getUserCampaignMemberships({ role });
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });
}
