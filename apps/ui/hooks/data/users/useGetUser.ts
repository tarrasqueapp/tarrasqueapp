import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { api } from '../../../lib/api';
import { UserInterface } from '../../../lib/types';

/**
 * Send a request to get the user
 * @returns The user data
 */
async function getUser() {
  const { data } = await api.get<UserInterface>(`/api/auth`);
  return data;
}

/**
 * Get the user
 * @returns User query
 */
export function useGetUser() {
  return useQuery<UserInterface, AxiosResponse>([`auth`], getUser);
}
