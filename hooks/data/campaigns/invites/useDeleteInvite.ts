import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { Invite, deleteInvite } from '@/actions/invites';
import { validation } from '@/lib/validation';

/**
 * Delete a campaign invite
 * @returns Delete invite mutation
 */
export function useDeleteInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invite: z.infer<typeof validation.schemas.invites.deleteInvite>) => {
      const response = await deleteInvite(invite);
      if (response?.error) {
        throw new Error(response.error);
      }
    },
    onMutate: async (invite) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['campaigns', invite.campaign_id, 'invites'] });

      // Snapshot the previous value
      const previousInvites = queryClient.getQueryData<Invite[]>(['campaigns', invite.campaign_id, 'invites']);

      // Optimistically update to the new value
      queryClient.setQueryData(['campaigns', invite.campaign_id, 'invites'], (oldInvites: Invite[]) => {
        return oldInvites?.filter((oldInvite) => oldInvite.id !== invite.id);
      });

      // Return a context object with the snapshotted value
      return { previousInvites };
    },
    onError: (err, invite, context) => {
      // Rollback to the previous value
      queryClient.setQueryData(['campaigns', invite.campaign_id, 'invites'], context?.previousInvites);
    },
    // Always refetch after error or success
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', variables.campaign_id, 'invites'] });
    },
  });
}
