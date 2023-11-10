import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { api } from '../../../../lib/api';
import { EventTokenEntity } from '../../../../lib/types';
import { NotificationsInterface } from '../../users/notifications/useGetNotifications';

/**
 * Send a request to decline an invite of a user to a campaign
 * @param invite - The invite to decline
 * @returns The updated notifications
 */
async function declineCampaignInvite(invite: EventTokenEntity) {
  const { data } = await api.post<void>(`/api/campaigns/${invite.campaignId}/invites/${invite.id}/decline`);
  return data;
}

/**
 * Decline an invite of a user to a campaign
 * @returns Decline campaign invite mutation
 */
export function useDeclineCampaignInvite() {
  const queryClient = useQueryClient();

  return useMutation(declineCampaignInvite, {
    // Optimistic update
    onMutate: async (invite) => {
      await queryClient.cancelQueries([`notifications`]);
      const previousNotifications = queryClient.getQueryData<NotificationsInterface>([`notifications`]);
      queryClient.setQueryData([`notifications`], (old: NotificationsInterface = { campaignInvites: [] }) => ({
        ...old,
        campaignInvites: old.campaignInvites.filter((i) => i.id !== invite.id),
      }));
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
      queryClient.invalidateQueries([`notifications`]);
      queryClient.invalidateQueries([`campaigns`]);
    },
  });
}
