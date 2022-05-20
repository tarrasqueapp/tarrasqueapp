import { useQuery } from 'react-query';

import { api } from '../../../lib/api';
import { SetupInterface } from '../../../lib/types';

/**
 * Send a request to get the setup
 * @returns Setup progress
 */
async function getSetup() {
  const { data } = await api.get<SetupInterface>(`/api/setup`);
  return data;
}

/**
 * Get the setup
 * @returns Setup query
 */
export function useGetSetup() {
  return useQuery(`setup`, () => getSetup());
}
