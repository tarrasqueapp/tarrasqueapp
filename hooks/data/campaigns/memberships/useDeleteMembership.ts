import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { api } from '../../../../lib/api';
import { MembershipEntity } from '../../../../lib/types';

/**
 * Send a request to delete a membership from a campaign
 * @param membership - The membership to delete
 * @returns The deleted membership
 */
async function deleteMembership(membership: MembershipEntity) {
  const { data } = await api.delete<MembershipEntity>(
    `/api/campaigns/${membership.campaignId}/memberships/${membership.userId}`,
  );
  return data;
}

/**
 * Delete a membership from a campaign
 * @returns Delete campaign membership mutation
 */
export function useDeleteMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMembership,
    // Optimistic update
    onMutate: async (membership) => {
      const queryKey = ['campaigns', membership.campaignId, 'memberships'];
      await queryClient.cancelQueries({ queryKey });
      const previousMemberships = queryClient.getQueryData<MembershipEntity[]>(queryKey);
      queryClient.setQueryData(queryKey, (old: Partial<MembershipEntity>[] = []) =>
        old.filter((m) => m.userId !== membership.userId),
      );
      return { previousMemberships };
    },
    // Rollback
    onError: (err, membership, context) => {
      queryClient.setQueryData(['campaigns', membership.campaignId, 'memberships'], context?.previousMemberships);
    },
    // Refetch
    onSettled: (membership, err: Error | null) => {
      if (err) {
        toast.error(err.message);
      }
      queryClient.invalidateQueries({ queryKey: ['campaigns', membership?.campaignId, 'memberships'] });
    },
  });
}
