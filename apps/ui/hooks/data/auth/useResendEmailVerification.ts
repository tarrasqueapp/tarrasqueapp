import { useMutation } from '@tanstack/react-query';

import { api } from '../../../lib/api';

/**
 * Send a request to resend the email verification
 * @param email - The user's email
 */
async function resendEmailVerification(email: string) {
  const { data } = await api.post<void>(`/api/auth/resend-email-verification`, { email });
  return data;
}

/**
 * Resend the email verification
 * @returns Resend email verification mutation
 */
export function useResendEmailVerification() {
  return useMutation({ mutationFn: resendEmailVerification });
}
