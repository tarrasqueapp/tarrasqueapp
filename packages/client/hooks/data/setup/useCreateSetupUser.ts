import { useMutation } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { SetupInterface, UserInterface } from '../../../lib/types';

/**
 * Send a request to create the user
 * @returns The created user
 */
async function createSetupUser(user: Partial<UserInterface>) {
  const { data } = await api.post<SetupInterface>(`/api/setup/create-user`, user);
  return data;
}

/**
 * Create the user
 * @returns Create user mutation
 */
export function useCreateSetupUser() {
  return useMutation(createSetupUser);
}
