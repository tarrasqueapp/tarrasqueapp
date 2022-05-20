import { useRouter } from 'next/router';

import { useGetMap } from './useGetMap';

/**
 * Get the currently active map
 * @returns Current map query
 */
export function useGetCurrentMap() {
  const router = useRouter();
  return useGetMap(router.query.mapId as string);
}
