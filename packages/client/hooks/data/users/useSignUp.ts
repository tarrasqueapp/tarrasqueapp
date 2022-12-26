import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { UserInterface } from '../../../lib/types';

/**
 * Send a request to sign up the user
 * @returns The user details
 */
async function signUp(user: Partial<UserInterface>) {
  const { data } = await api.post<UserInterface>(`/api/auth/sign-up`, user);
  return data;
}

/**
 * Sign up the user
 * @returns Sign up user mutation
 */
export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation(signUp, {
    onSuccess: () => {
      queryClient.invalidateQueries([`auth`]);
      queryClient.invalidateQueries([`auth/refresh`]);
    },
  });
}
