import { useQuery } from '@tanstack/react-query';

import { getPlugin } from '@/actions/plugins';

/**
 * Get all available plugins
 * @returns Plugins query
 */
export function useGetPlugin(manifestUrl: string) {
  return useQuery({
    queryKey: ['plugins', manifestUrl],
    queryFn: async () => {
      const response = await getPlugin({ manifestUrl });
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: Boolean(manifestUrl),
  });
}
