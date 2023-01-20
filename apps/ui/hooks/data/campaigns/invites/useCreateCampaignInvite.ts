import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { api } from '../../../../lib/api';
import { CampaignInterface } from '../../../../lib/types';

interface CampaignInviteInterface {
  campaign: Partial<CampaignInterface>;
  email: string;
}

/**
 * Send a request to invite a user to a campaign
 * @param campaign - The campaign to invite a user to
 * @param email - The email of the user to invite
 * @returns The updated campaign
 */
async function createCampaignInvite({ campaign, email }: CampaignInviteInterface) {
  const { data } = await api.post<CampaignInterface>(`/api/campaigns/${campaign.id}/invites`, { email });
  return data;
}

/**
 * Invite a user to a campaign
 * @returns Campaign invite mutation
 */
export function useCreateCampaignInvite() {
  const queryClient = useQueryClient();

  return useMutation(createCampaignInvite, {
    // Optimistic update
    onMutate: async ({ campaign, email }) => {
      await queryClient.cancelQueries([`campaigns`]);
      const previousCampaigns = queryClient.getQueryData<CampaignInterface[]>([`campaigns`]);
      const id = Math.random().toString(36).substring(2, 9);
      queryClient.setQueryData([`campaigns`], (old: Partial<CampaignInterface>[] = []) =>
        old.map((c) =>
          c.id === campaign.id
            ? {
                ...campaign,
                invites: [
                  ...campaign.invites!,
                  { id, email, createdAt: new Date().toISOString(), campaignId: campaign.id! },
                ],
              }
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
