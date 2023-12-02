import { useQuery } from '@tanstack/react-query';
import { RawAxiosRequestConfig } from 'axios';

import { SubmittedPluginEntity } from '@tarrasque/common';

import { api } from '../../../lib/api';

/**
 * Send a request to get all submitted plugins
 * @param requestConfig - Axios request config
 * @returns The plugins
 */
export async function getSubmittedPlugins(requestConfig?: RawAxiosRequestConfig) {
  const { data } = await api.get<SubmittedPluginEntity[]>(`/api/plugins`, requestConfig);
  return data;
}

/**
 * Get all submitted plugins
 * @returns Submitted plugins query
 */
export function useGetSubmittedPlugins() {
  return useQuery({
    queryKey: ['plugins'],
    queryFn: () => getSubmittedPlugins(),
  });
}
