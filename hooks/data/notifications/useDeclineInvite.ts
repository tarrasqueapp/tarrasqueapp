import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { api } from '@/lib/api';
import { ActionTokenEntity, NotificationEntity } from '@/lib/types';

/**
 * Send a request to decline an invite of a user to a campaign
 * @param invite - The invite to decline
 * @returns The updated notifications
 */
async function declineInvite(invite: ActionTokenEntity) {
  const { data } = await api.post<void>(`/api/campaigns/${invite.campaignId}/invites/${invite.id}/decline`);
  return data;
}

/**
 * Decline an invite of a user to a campaign
 * @returns Decline campaign invite mutation
 */
export function useDeclineInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: declineInvite,
    // Optimistic update
    onMutate: async (invite) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousNotifications = queryClient.getQueryData<NotificationEntity[]>(['notifications']);
      queryClient.setQueryData<NotificationEntity[] | undefined>(['notifications'], (notifications) => {
        if (!notifications) return;
        return notifications.filter((n) => n.data.id !== invite.id);
      });
      return { previousNotifications };
    },
    // Rollback
    onError: (err, notifications, context) => {
      queryClient.setQueryData(['notifications'], context?.previousNotifications);
    },
    // Refetch
    onSettled: (notifications, err: Error | null) => {
      if (err) {
        toast.error(err.message);
      }
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
