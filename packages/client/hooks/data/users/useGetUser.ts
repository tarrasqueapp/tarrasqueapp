import { useQuery } from 'react-query';

import { api } from '../../../lib/api';
import { UserInterface } from '../../../lib/types';

/**
 * Send a request to get the user
 * @returns Setup progress
 */
async function getUser() {
  const { data } = await api.get<UserInterface>(`/api/auth`);
  return data;
}

/**
 * Get the user
 * @returns Setup query
 */
export function useGetUser() {
  return useQuery(`auth`, () => getUser());
}
