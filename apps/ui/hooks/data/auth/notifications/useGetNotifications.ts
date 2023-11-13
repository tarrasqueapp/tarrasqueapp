import { useQuery } from '@tanstack/react-query';

import { ActionTokenEntity } from '@tarrasque/sdk';

import { api } from '../../../../lib/api';

export interface NotificationsInterface {
  campaignInvites: ActionTokenEntity[];
}

/**
 * Send a request to get the user notifications
 * @returns The user notifications data
 */
async function getNotifications() {
  const { data } = await api.get<NotificationsInterface>(`/api/auth/notifications`);
  return data;
}

/**
 * Get the user notifications
 * @returns User notifications query
 */
export function useGetNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });
}
