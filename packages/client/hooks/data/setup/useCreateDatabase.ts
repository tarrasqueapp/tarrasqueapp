import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../../lib/api';
import { SetupInterface } from '../../../lib/types';

/**
 * Send a request to create the database
 * @returns The setup progress
 */
async function createDatabase() {
  const { data } = await api.post<SetupInterface>(`/api/setup/create-database`);
  return data;
}

/**
 * Create the database
 * @returns Create database mutation
 */
export function useCreateDatabase() {
  const queryClient = useQueryClient();

  return useMutation(createDatabase, {
    onSuccess: () => {
      queryClient.invalidateQueries(['setup']);
    },
  });
}
