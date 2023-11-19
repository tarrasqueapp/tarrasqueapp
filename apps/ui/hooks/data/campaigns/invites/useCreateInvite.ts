import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { ActionTokenEntity } from '@tarrasque/sdk';

import { api } from '../../../../lib/api';

/**
 * Send a request to invite a user to a campaign
 * @param campaign - The campaign to invite a user to
 * @param email - The email of the user to invite
 * @returns The updated campaign
 */
async function createInvite(invite: Partial<ActionTokenEntity>) {
  const { data } = await api.post<ActionTokenEntity>(`/api/campaigns/${invite.campaignId}/invites`, {
    email: invite.email,
  });
  return data;
}

/**
 * Invite a user to a campaign
 * @returns Campaign invite mutation
 */
export function useCreateInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvite,
    onSettled: (invite, err: Error | null) => {
      if (err) {
        toast.error(err.message);
      }
      queryClient.invalidateQueries({ queryKey: ['campaigns', invite?.campaignId, 'invites'] });
    },
  });
}
