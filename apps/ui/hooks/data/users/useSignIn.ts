import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { UserEntity } from '../../../lib/types';

/**
 * Send a request to sign in the user
 * @param user - The user details
 * @returns The user details
 */
async function signIn(user: Partial<UserEntity>) {
  const { data } = await api.post<UserEntity>(`/api/auth/sign-in`, user);
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
    },
  });
}
