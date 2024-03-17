'use server';

import { z } from 'zod';

import { createServerClient } from '@/utils/supabase/server';
import { Enums } from '@/utils/supabase/types.gen';
import { validation } from '@/utils/validation';

import { getProfile } from './profiles';

export type UserMembership = NonNullable<Awaited<ReturnType<typeof getUserCampaignMemberships>>['data']>[number];
export type Membership = NonNullable<Awaited<ReturnType<typeof getMemberships>>['data']>[number];
export type CampaignMemberRole = Enums<'campaign_member_role'>;

/**
 * Get a user's campaign memberships
 * @param role - The role to filter by
 * @returns The user's campaign memberships
 */
export async function getUserCampaignMemberships({
  role,
}: z.infer<typeof validation.schemas.memberships.getUserCampaignMemberships>) {
  // Validate inputs
  validation.schemas.memberships.getUserCampaignMemberships.parse({ role });

  // Connect to Supabase
  const supabase = createServerClient();

  // Get user
  const { data: profile } = await getProfile();
  if (!profile) {
    return { error: 'User not found' };
  }

  // Get the user's campaign memberships
  const query = supabase
    .from('campaign_memberships')
    .select(
      `
      *,
      campaign: campaigns!campaign_memberships_campaign_id_fkey (
        name
      )
      `,
    )
    .eq('user_id', profile.id);

  // Filter by role if specified
  if (role) {
    query.eq('role', role);
  }

  const { data, error } = await query;

  if (error) {
    return { error: error.message };
  }

  // Reorder the memberships by the user's campaign order
  const campaignOrder = (profile.campaign_order as string[]) || [];
  data?.sort((a, b) => {
    const aOrder = campaignOrder.findIndex((campaignId) => campaignId === a.campaign_id);
    const bOrder = campaignOrder.findIndex((campaignId) => campaignId === b.campaign_id);
    return aOrder - bOrder;
  });

  return { data };
}

/**
 * Get campaign's memberships
 * @param campaignId - The campaign to get memberships for
 * @returns The campaign's memberships
 */
export async function getMemberships(campaignId: string) {
  // Validate inputs
  z.string().uuid().parse(campaignId);

  // Connect to Supabase
  const supabase = createServerClient();

  // Get the memberships
  const { data, error } = await supabase
    .from('campaign_memberships')
    .select(
      `
      *,
      user: profiles!campaign_memberships_user_id_fkey (
        id,
        name,
        email,
        avatar: media!profiles_avatar_id_fkey (
          *
        )
      )
      `,
    )
    .eq('campaign_id', campaignId);

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Update a membership
 * @param id - The membership to update
 * @param color - The membership's color
 * @param role - The membership's role
 */
export async function updateMembership({
  id,
  color,
  role,
}: z.infer<typeof validation.schemas.memberships.updateMembership>) {
  // Validate inputs
  validation.schemas.memberships.updateMembership.parse({ id, color, role });

  // Connect to Supabase
  const supabase = createServerClient();

  // Update the membership
  const { error } = await supabase
    .from('campaign_memberships')
    .update({
      color,
      role,
    })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }
}

/**
 * Delete a membership
 * @param id - The membership to delete
 */
export async function deleteMembership({ id }: z.infer<typeof validation.schemas.memberships.deleteMembership>) {
  // Validate inputs
  validation.schemas.memberships.deleteMembership.parse({ id });

  // Connect to Supabase
  const supabase = createServerClient();

  // Delete the membership
  const { error } = await supabase.from('campaign_memberships').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }
}
