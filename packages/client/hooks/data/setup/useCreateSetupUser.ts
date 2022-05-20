import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../../lib/api';
import { SetupInterface, UserInterface } from '../../../lib/types';

/**
 * Send a request to create the user
 * @returns The setup progress
 */
async function createSetupUser(user: Partial<UserInterface>) {
  const { data } = await api.post<SetupInterface>(`/api/setup/create-user`, user);
  return data;
}

/**
 * Create the user
 * @returns Create user mutation
 */
export function useCreateSetupUser() {
  const queryClient = useQueryClient();

  return useMutation(createSetupUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(`setup`);
    },
  });
}
