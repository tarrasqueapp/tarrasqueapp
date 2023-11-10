import { useMutation } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { UserEntity } from '../../../lib/types';

/**
 * Send a request to sign up the user
 * @param user - The user details
 */
async function signUp(user: Partial<UserEntity>) {
  const { data } = await api.post<UserEntity>(`/api/auth/sign-up`, user);
  return data;
}

/**
 * Sign up the user
 * @returns Sign up user mutation
 */
export function useSignUp() {
  return useMutation(signUp);
}
