import { useQuery } from '@tanstack/react-query';

import { ManifestEntity } from '@tarrasque/common';

import { api } from '../../../lib/api';

/**
 * Send a request to get all available plugins
 * @returns The plugins
 */
export async function getPlugin(manifestUrl: string) {
  const { data } = await api.get<ManifestEntity>(manifestUrl);
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
