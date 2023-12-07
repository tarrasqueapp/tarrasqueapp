import { useQuery } from '@tanstack/react-query';
import { RawAxiosRequestConfig } from 'axios';

import { api } from '../../../lib/api';
import { NotificationEntity } from '../../../lib/types';

/**
 * Send a request to get the user's notifications
 * @param requestConfig - Axios request config
 * @returns The user's notifications
 */
export async function getNotifications(requestConfig?: RawAxiosRequestConfig) {
  const { data } = await api.get<NotificationEntity[]>(`/api/notifications`, requestConfig);
  return data;
}

/**
 * Get the user's notifications
 * @returns Notifications query
 */
export function useGetNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(),
  });
}
