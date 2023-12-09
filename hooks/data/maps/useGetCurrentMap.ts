import { useParams } from 'next/navigation';

import { useGetMap } from './useGetMap';

/**
 * Get the currently active map
 * @returns Current map query
 */
export function useGetCurrentMap() {
  const params = useParams();

  const mapId = params.mapId as string;

  return useGetMap(mapId);
}
