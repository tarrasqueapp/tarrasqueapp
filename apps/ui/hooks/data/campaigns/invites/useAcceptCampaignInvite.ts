import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { api } from '../../../../lib/api';
import { EventTokenEntity } from '../../../../lib/types';
import { NotificationsInterface } from '../../users/notifications/useGetNotifications';

/**
 * Send a request to accept an invite of a user to a campaign
 * @param invite - The invite to accept
 * @returns The updated notifications
 */
async function acceptCampaignInvite(invite: EventTokenEntity) {
  const { data } = await api.post<void>(`/api/campaigns/${invite.campaignId}/invites/${invite.id}/accept`);
  return data;
}

/**
 * Accept an invite of a user to a campaign
 * @returns Accept campaign invite mutation
 */
export function useAcceptCampaignInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptCampaignInvite,
    // Optimistic update
    onMutate: async (invite) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousNotifications = queryClient.getQueryData<NotificationsInterface>(['notifications']);
      queryClient.setQueryData(['notifications'], (old: NotificationsInterface = { campaignInvites: [] }) => ({
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
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}
