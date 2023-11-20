import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UserEntity } from '@tarrasque/sdk';

import { api } from '../../../lib/api';

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

  return useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
