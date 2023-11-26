import { useQuery } from '@tanstack/react-query';
import { RawAxiosRequestConfig } from 'axios';

import { PluginEntity } from '@tarrasque/common';

import { api } from '../../../lib/api';

/**
 * Send a request to get all available plugins
 * @param requestConfig - Axios request config
 * @returns The plugins
 */
export async function getPlugins(requestConfig?: RawAxiosRequestConfig) {
  const { data } = await api.get<PluginEntity[]>(`/api/plugins`, requestConfig);
  return data;
}

/**
 * Get all available plugins
 * @returns Plugins query
 */
export function useGetPlugins() {
  return useQuery({
    queryKey: ['plugins'],
    queryFn: () => getPlugins(),
  });
}
