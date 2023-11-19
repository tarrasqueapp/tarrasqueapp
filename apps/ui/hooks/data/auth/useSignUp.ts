import { useMutation } from '@tanstack/react-query';

import { UserEntity } from '@tarrasque/sdk';

import { api } from '../../../lib/api';

/**
 * Send a request to sign up the user
 * @param user - The user details
 */
async function signUp(user: Partial<UserEntity & { token?: string }>) {
  const { data } = await api.post<UserEntity>(`/api/auth/sign-up`, user);
  return data;
}

/**
 * Sign up the user
 * @returns Sign up user mutation
 */
export function useSignUp() {
  return useMutation({ mutationFn: signUp });
}
