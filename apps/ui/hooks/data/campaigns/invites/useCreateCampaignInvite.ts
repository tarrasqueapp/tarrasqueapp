import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { api } from '../../../../lib/api';
import { ActionTokenEntity, ActionTokenType, CampaignEntity } from '../../../../lib/types';

interface CampaignInviteInterface {
  campaign: Partial<CampaignEntity>;
  email: string;
}

/**
 * Send a request to invite a user to a campaign
 * @param campaign - The campaign to invite a user to
 * @param email - The email of the user to invite
 * @returns The updated campaign
 */
async function createCampaignInvite({ campaign, email }: CampaignInviteInterface) {
  const { data } = await api.post<CampaignEntity>(`/api/campaigns/${campaign.id}/invites`, { email });
  return data;
}

/**
 * Invite a user to a campaign
 * @returns Campaign invite mutation
 */
export function useCreateCampaignInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCampaignInvite,
    // Optimistic update
    onMutate: async ({ campaign, email }) => {
      await queryClient.cancelQueries({ queryKey: ['campaigns'] });
      const previousCampaigns = queryClient.getQueryData<CampaignEntity[]>(['campaigns']);
      const id = Math.random().toString(36).substring(2, 9);
      queryClient.setQueryData(['campaigns'], (old: Partial<CampaignEntity>[] = []) =>
        old.map((c) =>
          c.id === campaign.id
            ? {
                ...campaign,
                invites: [
                  ...campaign.invites!,
                  {
                    id,
                    type: ActionTokenType.INVITE,
                    email,
                    payload: {},
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    expiresAt: new Date(),
                    userId: null,
                    campaignId: campaign.id!,
                  } as ActionTokenEntity,
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
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}
