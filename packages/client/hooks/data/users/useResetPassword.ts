import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { UserInterface } from '../../../lib/types';

/**
 * Send a request to check if the reset password token is valid
 * @param token - The reset password token
 * @returns The user data
 */
export async function checkResetPasswordToken(token: string) {
  const { data } = await api.post<void>(`/api/auth/check-reset-password-token`, { token });
  return data;
}

interface ResetPasswordInterface {
  token: string;
  password: string;
}

/**
 * Send a password reset request
 * @param token - The reset password token
 * @param password - The new password
 * @returns The signed in user
 */
async function resetPassword({ token, password }: ResetPasswordInterface) {
  const { data } = await api.post<UserInterface>(`/api/auth/reset-password`, { token, password });
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
      queryClient.invalidateQueries([`auth/refresh`]);
    },
  });
}
