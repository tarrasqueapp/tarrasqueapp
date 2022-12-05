import { useQuery } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';

import { api } from '../../../lib/api';
import { UserInterface } from '../../../lib/types';

/**
 * Send a request to get the user
 * @returns Setup progress
 */
export async function getUser(config?: AxiosRequestConfig) {
  const { data } = await api.get<UserInterface>(`/api/auth`, config);
  return data;
}

/**
 * Get the user
 * @returns Setup query
 */
export function useGetUser() {
  return useQuery([`auth`], () => getUser());
}
