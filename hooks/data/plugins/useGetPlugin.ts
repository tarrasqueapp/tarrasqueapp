import { useQuery } from '@tanstack/react-query';

import { ManifestEntity } from '@/lib/types';

/**
 * Send a request to get all available plugins
 * @returns The plugins
 */
export async function getPlugin(manifestUrl: string) {
  const response = await fetch(manifestUrl);
  const data = (await response.json()) as ManifestEntity;
  return data;
}

/**
 * Get all available plugins
 * @returns Plugins query
 */
export function useGetPlugin(manifestUrl: string) {
  return useQuery({
    queryKey: ['plugins', manifestUrl],
    queryFn: () => getPlugin(manifestUrl),
    enabled: Boolean(manifestUrl),
  });
}
