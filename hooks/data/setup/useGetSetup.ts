import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getSetup } from '@/actions/setup';
import { createBrowserClient } from '@/utils/supabase/client';

/**
 * Get the setup
 * @returns Setup query
 */
export function useGetSetup() {
  const queryClient = useQueryClient();

  // Listen for changes to the setup and update the cache
  useEffect(() => {
    let supabase: SupabaseClient;
    let channel: RealtimeChannel;

    requestAnimationFrame(() => {
      supabase = createBrowserClient();
      channel = supabase
        .channel('setup')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'setup' }, (payload) => {
          queryClient.setQueryData(['setup'], payload.new);
        })
        .subscribe();
    });

    return () => {
      if (!supabase || !channel) return;
      supabase.removeChannel(channel);
    };
  }, []);

  return useQuery({
    queryKey: ['setup'],
    queryFn: async () => {
      const response = await getSetup();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });
}
