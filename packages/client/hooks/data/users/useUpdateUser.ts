import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { UserInterface } from '../../../lib/types';

/**
 * Send a request to update the user
 * @param user - The user to update with
 * @returns The updated user
 */
async function updateUser(user: Partial<UserInterface>) {
  const { data } = await api.put<UserInterface>(`/api/auth`, user);
  return data;
}

/**
 * Update user
 * @returns User update mutation
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries([`auth`]);
    },
  });
}
