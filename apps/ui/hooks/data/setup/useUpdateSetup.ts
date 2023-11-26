import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SetupEntity } from '@tarrasque/common';

import { api } from '../../../lib/api';

/**
 * Send a request to update setup
 * @param setup - The setup to update with
 * @returns The updated setup
 */
async function updateSetup(setup: Partial<SetupEntity>) {
  const { data } = await api.put<SetupEntity>(`/api/setup`, setup);
  return data;
}

/**
 * Update setup
 * @returns Setup update mutation
 */
export function useUpdateSetup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSetup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['setup'] });
    },
  });
}
