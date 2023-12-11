import { useQuery } from '@tanstack/react-query';

import { getSubmittedPlugins } from '@/actions/plugins';

/**
 * Get all submitted plugins
 * @returns Submitted plugins query
 */
export function useGetSubmittedPlugins() {
  return useQuery({
    queryKey: ['plugins'],
    queryFn: () => getSubmittedPlugins(),
  });
}
