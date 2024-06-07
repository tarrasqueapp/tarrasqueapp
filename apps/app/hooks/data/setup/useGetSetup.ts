import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getSetup } from '@/actions/setup';

import { useSupabaseSubscription } from '../useSupabaseSubscription';

/**
 * Get the setup
 * @returns Setup query
 */
export function useGetSetup() {
  const queryClient = useQueryClient();

  const queryKey = ['setup'];

  useSupabaseSubscription({
    channelName: 'setup',
    table: 'setup',
    onChange: (payload) => {
      queryClient.setQueryData(queryKey, payload.new);
    },
  });

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await getSetup();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });
}
