import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { api } from '../../../../lib/api';
import { CampaignEntity, CampaignMemberEntity } from '../../../../lib/types';

interface UpdateCampaignMemberInterface {
  campaign: Partial<CampaignEntity>;
  member: CampaignMemberEntity;
}

/**
 * Send a request to update a member of a campaign
 * @param campaign - The campaign to update a member on
 * @param member - The member to update
 * @returns The updated campaign
 */
async function updateCampaignMember({ campaign, member }: UpdateCampaignMemberInterface) {
  const { data } = await api.put<CampaignEntity>(`/api/campaigns/${campaign.id}/members/${member.id}`, {
    role: member.role,
  });
  return data;
}

/**
 * Update a member of a campaign
 * @returns Update campaign member mutation
 */
export function useUpdateCampaignMember() {
  const queryClient = useQueryClient();

  return useMutation(updateCampaignMember, {
    // Optimistic update
    onMutate: async ({ campaign, member }) => {
      await queryClient.cancelQueries([`campaigns`]);
      const previousCampaigns = queryClient.getQueryData<CampaignEntity[]>([`campaigns`]);
      queryClient.setQueryData([`campaigns`], (old: Partial<CampaignEntity>[] = []) =>
        old.map((c) =>
          c.id === campaign.id
            ? { ...campaign, members: campaign.members?.map((i) => (i.id === member.id ? member : i)) }
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
      queryClient.invalidateQueries([`campaigns`]);
    },
  });
}
