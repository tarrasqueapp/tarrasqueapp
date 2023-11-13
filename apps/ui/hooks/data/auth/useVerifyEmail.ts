import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UserEntity } from '@tarrasque/sdk';

import { api } from '../../../lib/api';

/**
 * Send a request to verify the user's email
 * @param token - The email verification token
 * @returns The user details
 */
async function verifyEmail(token: string) {
  const { data } = await api.post<UserEntity>(`/api/auth/verify-email`, { token });
  return data;
}

/**
 * Verify the user's email
 * @returns Verify email mutation
 */
export function useVerifyEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
}
