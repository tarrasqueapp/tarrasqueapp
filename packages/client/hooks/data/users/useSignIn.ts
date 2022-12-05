import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { UserInterface } from '../../../lib/types';

/**
 * Send a request to sign in the user
 * @returns The user details
 */
async function signIn(user: Partial<UserInterface>) {
  const { data } = await api.post<UserInterface>(`/api/auth/sign-in`, user);
  return data;
}

/**
 * Sign in the user
 * @returns Sign in user mutation
 */
export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation(signIn, {
    onSuccess: () => {
      queryClient.invalidateQueries([`auth`]);
      queryClient.invalidateQueries([`auth/refresh`]);
    },
  });
}
