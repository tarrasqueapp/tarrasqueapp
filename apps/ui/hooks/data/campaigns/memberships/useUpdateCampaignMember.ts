import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { CampaignEntity, MembershipEntity } from '@tarrasque/sdk';

import { api } from '../../../../lib/api';

interface UpdateCampaignMemberInterface {
  campaign: Partial<CampaignEntity>;
  membership: MembershipEntity;
}

/**
 * Send a request to update a member of a campaign
 * @param campaign - The campaign to update a member on
 * @param membership - The membership to update
 * @returns The updated campaign
 */
async function updateCampaignMember({ campaign, membership }: UpdateCampaignMemberInterface) {
  const { data } = await api.put<CampaignEntity>(`/api/campaigns/${campaign.id}/memberships/${membership.id}`, {
    role: membership.role,
  });
  return data;
}

/**
 * Update a member of a campaign
 * @returns Update campaign member mutation
 */
export function useUpdateCampaignMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCampaignMember,
    // Optimistic update
    onMutate: async ({ campaign, membership }) => {
      await queryClient.cancelQueries({ queryKey: ['campaigns'] });
      const previousCampaigns = queryClient.getQueryData<CampaignEntity[]>(['campaigns']);
      queryClient.setQueryData(['campaigns'], (old: Partial<CampaignEntity>[] = []) =>
        old.map((c) =>
          c.id === campaign.id
            ? { ...campaign, memberships: campaign.memberships?.map((i) => (i.id === membership.id ? membership : i)) }
            : c,
        ),
      );
      return { previousCampaigns };
    },
    // Rollback
    onError: (err, campaign, context) => {
      queryClient.setQueryData(['campaigns'], context?.previousCampaigns);
    },
    // Refetch
    onSettled: (campaign, err: Error | null) => {
      if (err) {
        toast.error(err.message);
      }
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}
