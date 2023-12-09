import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { ExternalNavigation } from '@/lib/navigation';

/**
 * Send a request to get the live version of Tarrasque App
 * @returns The version data
 */
async function getLiveVersion() {
  const { data } = await api.get<{ version: string }>(`${ExternalNavigation.Website}/api/version`);
  return data;
}

/**
 * Get live version of Tarrasque App
 * @returns Version query
 */
export function useGetLiveVersion() {
  return useQuery({
    queryKey: ['version'],
    queryFn: () => getLiveVersion(),
  });
}
