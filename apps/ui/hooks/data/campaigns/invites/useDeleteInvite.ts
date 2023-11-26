import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { ActionTokenEntity } from '@tarrasque/common';

import { api } from '../../../../lib/api';

/**
 * Send a request to delete an invite of a user to a campaign
 * @param invite - The invite to delete
 * @returns The updated campaign
 */
async function deleteInvite(invite: ActionTokenEntity) {
  const { data } = await api.delete<ActionTokenEntity>(`/api/campaigns/${invite.campaignId}/invites/${invite.id}`);
  return data;
}

/**
 * Delete an invite of a user to a campaign
 * @returns Delete campaign invite mutation
 */
export function useDeleteInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInvite,
    // Optimistic update
    onMutate: async (invite) => {
      const queryKey = ['campaigns', invite.campaignId, 'invites'];
      await queryClient.cancelQueries({ queryKey: queryKey });
      const previousInvites = queryClient.getQueryData<ActionTokenEntity[]>(queryKey);
      queryClient.setQueryData<ActionTokenEntity[] | undefined>(queryKey, (invites) => {
        if (!invites) return;
        return invites.filter((i) => i.id !== invite.id);
      });
      return { previousInvites };
    },
    // Rollback
    onError: (err, invite, context) => {
      queryClient.setQueryData(['campaigns', invite.campaignId, 'invites'], context?.previousInvites);
    },
    // Refetch
    onSettled: (invite, err: Error | null) => {
      if (err) {
        toast.error(err.message);
      }
      queryClient.invalidateQueries({ queryKey: ['campaigns', invite?.campaignId, 'invites'] });
    },
  });
}
