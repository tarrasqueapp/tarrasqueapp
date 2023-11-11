import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../lib/api';

/**
 * Send a request to sign out the user
 * @returns The user data
 */
async function signOut() {
  const { data } = await api.post<void>(`/api/auth/sign-out`);
  return data;
}

/**
 * Create the user
 */
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onMutate: () => {
      queryClient.cancelQueries();
    },
    onSuccess: () => {
      setTimeout(() => queryClient.clear(), 100);
    },
  });
}
