import { useQuery } from '@tanstack/react-query';

import { ExternalNavigation } from '@/utils/navigation';

/**
 * Send a request to get the live version of Tarrasque App
 * @returns The version data
 */
async function getLiveVersion() {
  const response = await fetch(`${ExternalNavigation.Website}/api/version`);
  const data = await response.json();
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
