import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getMaps } from '@/actions/maps';

import { useSupabaseSubscription } from '../useSupabaseSubscription';

/**
 * Get the campaign's maps
 * @param campaignId - The ID of the campaign to get maps for
 * @returns Campaign maps query
 */
export function useGetCampaignMaps(campaignId?: string) {
  const queryClient = useQueryClient();

  const queryKey = ['campaigns', campaignId, 'maps'];

  useSupabaseSubscription({
    channelName: `campaign_${campaignId}_maps`,
    table: 'maps',
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
      const response = await getMaps(campaignId!);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: Boolean(campaignId),
  });
}
