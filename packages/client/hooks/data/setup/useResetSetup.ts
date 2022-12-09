import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { SetupInterface } from '../../../lib/types';

/**
 * Send a request to reset the setup
 * @returns The reseted setup
 */
async function resetSetup() {
  const { data } = await api.post<SetupInterface>(`/api/setup/reset`);
  return data;
}

/**
 * Reset the setup process
 * @returns Setup reset mutation
 */
export function useResetSetup() {
  const queryClient = useQueryClient();

  return useMutation(resetSetup, {
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
