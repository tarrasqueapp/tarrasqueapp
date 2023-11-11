import { useMutation } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { SetupEntity } from '../../../lib/types';

/**
 * Send a request to create the database
 * @returns The setup progress
 */
async function createDatabase() {
  const { data } = await api.post<SetupEntity>(`/api/setup/create-database`);
  return data;
}

/**
 * Create the database
 * @returns Create database mutation
 */
export function useCreateDatabase() {
  return useMutation({ mutationFn: createDatabase });
}
