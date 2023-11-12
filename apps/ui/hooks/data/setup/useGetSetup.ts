import { useQuery } from '@tanstack/react-query';
import { RawAxiosRequestConfig } from 'axios';

import { api } from '../../../lib/api';
import { SetupEntity } from '../../../lib/types';

/**
 * Send a request to get the setup
 * @returns Setup progress
 */
export async function getSetup(requestConfig?: RawAxiosRequestConfig) {
  const { data } = await api.get<SetupEntity>(`/api/setup`, requestConfig);
  return data;
}

/**
 * Get the setup
 * @returns Setup query
 */
export function useGetSetup() {
  return useQuery({
    queryKey: ['setup'],
    queryFn: () => getSetup(),
  });
}
