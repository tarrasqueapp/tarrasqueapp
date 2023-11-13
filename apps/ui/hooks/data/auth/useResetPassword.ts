import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UserEntity } from '@tarrasque/sdk';

import { api } from '../../../lib/api';

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

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
}
