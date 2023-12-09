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
    const supabase = createBrowserClient();
    const channel = supabase
      .channel('setup')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'setup' }, (payload) => {
        queryClient.setQueryData(['setup'], payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return useQuery({
    queryKey: ['setup'],
    queryFn: getSetup,
  });
}
