import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../../lib/api';
import { UserInterface } from '../../../lib/types';

/**
 * Send a request to create the user
 * @returns The setup progress
 */
async function login(user: Partial<UserInterface>) {
  const { data } = await api.post<UserInterface>(`/api/auth/login`, user);
  return data;
}

/**
 * Create the user
 * @returns Create user mutation
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation(login, {
    onSuccess: () => {
      queryClient.invalidateQueries(`auth`);
    },
  });
}
