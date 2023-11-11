import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { api } from '../../../../lib/api';
import { CampaignEntity, CampaignMemberEntity } from '../../../../lib/types';

interface DeleteCampaignMemberInterface {
  campaign: Partial<CampaignEntity>;
  member: CampaignMemberEntity;
}

/**
 * Send a request to delete a member from a campaign
 * @param campaign - The campaign to delete a member from
 * @param member - The member to delete
 * @returns The updated campaign
 */
async function deleteCampaignMember({ campaign, member }: DeleteCampaignMemberInterface) {
  const { data } = await api.delete<CampaignEntity>(`/api/campaigns/${campaign.id}/members/${member.id}`);
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
    onMutate: async ({ campaign, member }) => {
      await queryClient.cancelQueries({ queryKey: ['campaigns'] });
      const previousCampaigns = queryClient.getQueryData<CampaignEntity[]>(['campaigns']);
      queryClient.setQueryData(['campaigns'], (old: Partial<CampaignEntity>[] = []) =>
        old.map((c) =>
          c.id === campaign.id ? { ...campaign, members: campaign.members?.filter((i) => i.id !== member.id) } : c,
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
