import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { api } from '../../../../lib/api';
import { CampaignEntity, EventTokenEntity } from '../../../../lib/types';

interface DeleteCampaignInviteInterface {
  campaign: Partial<CampaignEntity>;
  invite: EventTokenEntity;
}

/**
 * Send a request to delete an invite of a user to a campaign
 * @param campaign - The campaign to delete an invite from
 * @param invite - The invite to delete
 * @returns The updated campaign
 */
async function deleteCampaignInvite({ campaign, invite }: DeleteCampaignInviteInterface) {
  const { data } = await api.delete<CampaignEntity>(`/api/campaigns/${campaign.id}/invites/${invite.id}`);
  return data;
}

/**
 * Delete an invite of a user to a campaign
 * @returns Delete campaign invite mutation
 */
export function useDeleteCampaignInvite() {
  const queryClient = useQueryClient();

  return useMutation(deleteCampaignInvite, {
    // Optimistic update
    onMutate: async ({ campaign, invite }) => {
      await queryClient.cancelQueries([`campaigns`]);
      const previousCampaigns = queryClient.getQueryData<CampaignEntity[]>([`campaigns`]);
      queryClient.setQueryData([`campaigns`], (old: Partial<CampaignEntity>[] = []) =>
        old.map((c) =>
          c.id === campaign.id ? { ...campaign, invites: campaign.invites?.filter((i) => i.id !== invite.id) } : c,
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
