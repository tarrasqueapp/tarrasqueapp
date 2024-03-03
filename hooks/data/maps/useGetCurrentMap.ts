import { usePixiStore } from '@/store/pixi';

import { useGetMap } from './useGetMap';

/**
 * Get the currently active map
 * @returns Current map query
 */
export function useGetCurrentMap() {
  const mapId = usePixiStore((state) => state.mapId) as string;

  return useGetMap(mapId);
}
