import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { api } from '@/lib/api';
import { ActionTokenEntity, NotificationEntity } from '@/lib/types';

/**
 * Send a request to accept an invite of a user to a campaign
 * @param invite - The invite to accept
 * @returns The updated notifications
 */
async function acceptInvite(invite: ActionTokenEntity) {
  const { data } = await api.post<void>(`/api/campaigns/${invite.campaignId}/invites/${invite.id}/accept`);
  return data;
}

/**
 * Accept an invite of a user to a campaign
 * @returns Accept campaign invite mutation
 */
export function useAcceptInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptInvite,
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
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}
