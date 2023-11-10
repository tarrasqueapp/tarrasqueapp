import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { UserEntity } from '../../../lib/types';

/**
 * Send a request to check if the password reset token is valid
 * @param token - The password reset token
 * @returns The user data
 */
export async function checkPasswordResetToken(token: string) {
  const { data } = await api.post<void>(`/api/auth/check-password-reset-token`, { token });
  return data;
}

interface ResetPasswordInterface {
  token: string;
  password: string;
}

/**
 * Send a password reset request
 * @param token - The password reset token
 * @param password - The new password
 * @returns The signed in user
 */
async function resetPassword({ token, password }: ResetPasswordInterface) {
  const { data } = await api.post<UserEntity>(`/api/auth/reset-password`, { token, password });
  return data;
}

/**
 * Request a password reset
 * @returns Reset password mutation
 */
export function useResetPassword() {
  const queryClient = useQueryClient();

  return useMutation(resetPassword, {
    onSuccess: () => {
      queryClient.invalidateQueries([`auth`]);
    },
  });
}
