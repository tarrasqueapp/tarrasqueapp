import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { api } from '../../../lib/api';
import { MapEntity } from '../../../lib/types';

interface ReorderMapsInterface {
  campaignId: string;
  mapIds: string[];
}

/**
 * Send a request to reorder maps
 * @param campaignId - The id of the campaign
 * @param mapIds - The new order of map ids
 * @returns The reordered maps
 */
async function reorderMaps({ campaignId, mapIds }: ReorderMapsInterface) {
  const { data } = await api.post<MapEntity>(`/api/campaigns/${campaignId}/maps/reorder`, { mapIds });
  return data;
}

/**
 * Reorder maps
 * @returns Maps reorder mutation
 */
export function useReorderMaps() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderMaps,
    // Optimistic update
    onMutate: async ({ campaignId, mapIds }) => {
      await queryClient.cancelQueries({ queryKey: ['campaigns', campaignId, 'maps'] });
      const previousMaps = queryClient.getQueryData<MapEntity[]>(['campaigns', campaignId, 'maps']);
      // Sort the maps based on the user's map order
      queryClient.setQueryData(['campaigns', campaignId, 'maps'], (maps: MapEntity[] = []) =>
        maps.sort((a, b) => {
          const aOrder = mapIds.findIndex((mapId) => mapId === a.id);
          const bOrder = mapIds.findIndex((mapId) => mapId === b.id);
          // If the user has no map order or the map is not in the order, sort by creation date
          if (aOrder === -1 || bOrder === -1) {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          }
          // Sort by the user's map order
          return aOrder - bOrder;
        }),
      );
      return { previousMaps };
    },
    // Rollback
    onError: (err, { campaignId }, context) => {
      queryClient.setQueryData(['campaigns', campaignId, 'maps'], context?.previousMaps);
    },
    // Refetch
    onSettled: (map, err: Error | null, variables) => {
      if (err) {
        toast.error(err.message);
      }
      queryClient.invalidateQueries({ queryKey: ['campaigns', variables.campaignId, 'maps'] });
    },
  });
}
