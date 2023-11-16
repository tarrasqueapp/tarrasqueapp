import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { CampaignEntity, MembershipEntity } from '@tarrasque/sdk';

import { api } from '../../../../lib/api';

interface DeleteCampaignMemberInterface {
  campaign: Partial<CampaignEntity>;
  membership: MembershipEntity;
}

/**
 * Send a request to delete a member from a campaign
 * @param campaign - The campaign to delete a member from
 * @param membership - The member to delete
 * @returns The updated campaign
 */
async function deleteCampaignMember({ campaign, membership }: DeleteCampaignMemberInterface) {
  const { data } = await api.delete<CampaignEntity>(`/api/campaigns/${campaign.id}/memberships/${membership.id}`);
  return data;
}

/**
 * Delete a member from a campaign
 * @returns Delete campaign member mutation
 */
export function useDeleteCampaignMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCampaignMember,
    // Optimistic update
    onMutate: async ({ campaign, membership }) => {
      await queryClient.cancelQueries({ queryKey: ['campaigns'] });
      const previousCampaigns = queryClient.getQueryData<CampaignEntity[]>(['campaigns']);
      queryClient.setQueryData(['campaigns'], (old: Partial<CampaignEntity>[] = []) =>
        old.map((c) =>
          c.id === campaign.id
            ? { ...campaign, memberships: campaign.memberships?.filter((i) => i.id !== membership.id) }
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
