import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getMemberships } from '@/actions/memberships';

import { useSupabaseSubscription } from '../../useSupabaseSubscription';

/**
 * Get the campaign's memberships
 * @param campaignId - The campaign to get memberships for
 * @returns Memberships query
 */
export function useGetMemberships(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  const queryKey = ['campaigns', campaignId, 'memberships'];

  useSupabaseSubscription({
    channelName: `campaigns_${campaignId}_memberships`,
    table: 'campaign_memberships',
    filter: `campaign_id=eq.${campaignId}`,
    onChange: (payload) => {
      // If the event is an insert or update, invalidate the query
      if (
        payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT ||
        payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE
      ) {
        queryClient.invalidateQueries({ queryKey });
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
      const response = await getMemberships(campaignId!);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: Boolean(campaignId),
  });
}
