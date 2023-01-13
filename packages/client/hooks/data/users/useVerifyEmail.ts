import { useMutation } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { UserInterface } from '../../../lib/types';

/**
 * Send a request to verify the user's email
 * @param token - The email verification token
 * @returns The user details
 */
export async function verifyEmail(token: string) {
  const { data } = await api.post<UserInterface>(`/api/auth/verify-email`, { token });
  return data;
}

/**
 * Verify the user's email
 * @returns Verify email mutation
 */
export function useVerifyEmail() {
  return useMutation(verifyEmail);
}
