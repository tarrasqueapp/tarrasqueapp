import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getSetup } from '../../../app/setup/actions';
import { createClient } from '../../../utils/supabase/client';

/**
 * Get the setup
 * @returns Setup query
 */
export function useGetSetup() {
  const queryClient = useQueryClient();

  // Listen for changes to the setup and update the cache
  useEffect(() => {
    const supabase = createClient();
    supabase
      .channel('setup')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'setup' }, (payload) => {
        queryClient.setQueryData(['setup'], payload.new);
      })
      .subscribe();
  }, []);

  return useQuery({
    queryKey: ['setup'],
    queryFn: getSetup,
  });
}
