import { useQuery } from '@tanstack/react-query';

import { api } from '../../../lib/api';

interface Manifest {
  id: string;
  name: string;
  version: string;
  description: string;
  icon: string;
  url: string;
}

/**
 * Send a request to get all available plugins
 * @returns The plugins
 */
export async function getPlugin(manifestUrl: string) {
  const { data } = await api.get<Manifest>(manifestUrl);
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
  });
}
