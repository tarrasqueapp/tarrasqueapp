import { useQuery } from '@tanstack/react-query';

import { api } from '../../../../lib/api';
import { EventTokenEntity } from '../../../../lib/types';

export interface NotificationsInterface {
  campaignInvites: EventTokenEntity[];
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
  return useQuery([`notifications`], getNotifications);
}
