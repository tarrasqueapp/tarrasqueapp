'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import { validation } from '@/lib/validation';
import { createServerClient } from '@/utils/supabase/server';
import { Enums } from '@/utils/supabase/types.gen';

export type Membership = NonNullable<Awaited<ReturnType<typeof getMemberships>>['data']>[number];
export type CampaignMemberRole = Enums<'campaign_member_role'>;

/**
 * Get campaign's memberships
 * @param campaignId - The campaign to get memberships for
 * @returns The campaign's memberships
 */
export async function getMemberships(campaignId: string) {
  // Validate inputs
  z.string().uuid().parse(campaignId);

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
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Delete the membership
  const { error } = await supabase.from('campaign_memberships').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }
}
