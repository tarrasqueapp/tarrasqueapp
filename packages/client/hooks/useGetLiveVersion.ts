import { useQuery } from '@tanstack/react-query';

import { api } from '../lib/api';

/**
 * Send a request to get the live version of Tarrasque App
 * @returns The version data
 */
async function getLiveVersion() {
  const { data } = await api.get<{ version: string }>(`https://tarrasque.app/api/version`);
  return data;
}

/**
 * Get live version of Tarrasque App
 * @returns Version query
 */
export function useGetLiveVersion() {
  return useQuery([`version`], () => getLiveVersion());
}
