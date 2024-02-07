'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import { validate } from '@/lib/validate';
import { createServerClient } from '@/utils/supabase/server';
import { Enums } from '@/utils/supabase/types.gen';

export type Membership = Awaited<ReturnType<typeof getMemberships>>[number];
export type CampaignMemberRole = Enums<'campaign_member_role'>;

/**
 * Get campaign's memberships
 * @param campaignId - The campaign to get memberships for
 * @returns The campaign's memberships
 */
export async function getMemberships(campaignId: string) {
  // Validate the campaign ID
  const schema = z.string().uuid();
  schema.parse(campaignId);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get the memberships
  const { data, error } = await supabase
    .from('campaign_memberships')
    .select(
      `
      *,
      user: profiles!campaign_memberships_user_id_fkey (
        display_name,
        email,
        avatar: media!profiles_avatar_id_fkey (
          *
        )
      )
      `,
    )
    .eq('campaign_id', campaignId);

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Update a membership
 * @param id - The membership to update
 * @param color - The membership's color
 * @param role - The membership's role
 */
export async function updateMembership({ id, color, role }: { id: string; color?: string; role?: CampaignMemberRole }) {
  // Validate the data
  const schema = z.object({
    id: z.string().uuid(),
    color: z.string().optional(),
    role: validate.fields.campaignMemberRole.optional(),
  });
  schema.parse({ id, color, role });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Update the membership
  const { error } = await supabase
    .from('campaign_memberships')
    .update({
      color,
      role,
    })
    .eq('id', id);

  if (error) {
    throw error;
  }
}

/**
 * Delete a membership
 * @param membershipId - The membership to delete
 */
export async function deleteMembership(membershipId: string) {
  // Validate the membership ID
  const schema = z.string().uuid();
  schema.parse(membershipId);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Delete the membership
  const { error } = await supabase.from('campaign_memberships').delete().eq('id', membershipId);

  if (error) {
    throw error;
  }
}
