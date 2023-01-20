import { useMutation } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { UserInterface } from '../../../lib/types';

/**
 * Send a request to sign up the user
 * @param user - The user details
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
  return useMutation(signUp);
}
