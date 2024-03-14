import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import { Invite, createInvite } from '@/actions/invites';
import { validation } from '@/lib/validation';

/**
 * Create a campaign invite
 * @returns Create invite mutation
 */
export function useCreateInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invite: z.infer<typeof validation.schemas.invites.createInvite>) => {
      const response = await createInvite(invite);
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
      queryClient.setQueryData(['campaigns', invite.campaign_id, 'invites'], (oldInvites: Invite[] | undefined) => {
        if (!oldInvites) return [];
        return [...oldInvites, { id: uuidv4(), ...invite }];
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
