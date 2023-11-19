import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { MembershipEntity } from '@tarrasque/sdk';

import { api } from '../../../../lib/api';

/**
 * Send a request to update a membership of a campaign
 * @param campaign - The campaign to update a membership on
 * @param membership - The membership to update
 * @returns The updated membership
 */
async function updateMembership(membership: MembershipEntity) {
  const { data } = await api.put<MembershipEntity>(
    `/api/campaigns/${membership.campaignId}/memberships/${membership.userId}`,
    {
      role: membership.role,
    },
  );
  return data;
}

/**
 * Update a membership of a campaign
 * @returns Update campaign membership mutation
 */
export function useUpdateMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMembership,
    // Optimistic update
    onMutate: async (membership) => {
      const queryKey = ['campaigns', membership.campaignId, 'memberships'];
      await queryClient.cancelQueries({ queryKey });
      const previousMemberships = queryClient.getQueryData<MembershipEntity[]>(queryKey);
      queryClient.setQueryData(queryKey, (old: Partial<MembershipEntity>[] = []) =>
        old.map((m) => (m.userId === membership.userId ? membership : m)),
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
