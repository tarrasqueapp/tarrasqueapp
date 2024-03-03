import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Grid, updateGrid } from '@/actions/grids';

/**
 * Update a map's grid
 * @returns Grid mutation
 */
export function useUpdateGrid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGrid,
    onMutate: async (newGrid) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['maps', newGrid.map_id, 'grid'] });

      // Snapshot the previous value
      const previousGrid = queryClient.getQueryData<Grid>(['maps', newGrid.map_id, 'grid']);

      // Optimistically update to the new value
      queryClient.setQueryData(['maps', newGrid.map_id, 'grid'], { ...previousGrid, ...newGrid });

      // Return a context object with the snapshotted value
      return { previousGrid };
    },
    onError: (err, newGrid, context) => {
      // Rollback to the previous value
      queryClient.setQueryData(['maps', newGrid.map_id, 'grid'], context?.previousGrid);
    },
    // Always refetch after error or success
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['maps', variables.map_id, 'grid'] });
    },
  });
}
