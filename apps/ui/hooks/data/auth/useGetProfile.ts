import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getProfile } from '../../../app/auth/actions';
import { createClient } from '../../../utils/supabase/client';

/**
 * Get the user profile
 * @returns User profile query
 */
export function useGetProfile() {
  const queryClient = useQueryClient();

  // Listen for changes to the user profile and update the cache
  useEffect(() => {
    const supabase = createClient();
    supabase
      .channel('profile')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
        queryClient.setQueryData(['profile'], payload.new);
      })
      .subscribe();
  }, []);

  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });
}
