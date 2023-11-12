import { useMutation } from '@tanstack/react-query';

import { api } from '../../../lib/api';

/**
 * Send a forgot password email
 * @param email - The email to send the forgot password email to
 */
async function forgotPassword(email: string) {
  const { data } = await api.post<void>(`/api/auth/forgot-password`, { email });
  return data;
}

/**
 * Request a forgot password email
 * @returns Forgot password mutation
 */
export function useForgotPassword() {
  return useMutation({ mutationFn: forgotPassword });
}
