import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';

import { api } from '../../../lib/api';

/**
 * Send a request to sign out the user
 */
async function signOut(config?: AxiosRequestConfig) {
  const { data } = await api.post(`/api/auth/sign-out`, config);
  return data;
}

/**
 * Create the user
 */
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation(() => signOut(), {
    onSuccess: () => {
      queryClient.clear();
    },
  });
}