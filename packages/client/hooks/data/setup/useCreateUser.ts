import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../../lib/api';
import { SetupInterface, UserInterface } from '../../../lib/types';

/**
 * Send a request to create the user
 * @returns The setup progress
 */
async function createUser(user: Partial<UserInterface>) {
  const { data } = await api.post<SetupInterface>(`/api/setup/create-user`, user);
  return data;
}

/**
 * Create the user
 * @returns Create user mutation
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['setup']);
    },
  });
}
