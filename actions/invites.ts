'use server';

import { cookies } from 'next/headers';
import uniqolor from 'uniqolor';
import { z } from 'zod';

import { config } from '@/lib/config';
import { validation } from '@/lib/validation';
import { createAdminServerClient } from '@/utils/supabase/admin';
import { createServerClient } from '@/utils/supabase/server';

import { sendCampaignInviteExistingUserEmail, sendCampaignInviteNewUserEmail } from './email';
import { getProfile } from './profiles';

export type Invite = NonNullable<Awaited<ReturnType<typeof getInvite>>['data']>;

/**
 * Get campaign's invites
 * @param campaignId - The campaign to get invites for
 * @returns The campaign's invites
 */
export async function getInvites(campaignId: string) {
  // Validate inputs
  z.string().uuid().parse(campaignId);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get the invites
  const { data, error } = await supabase.from('campaign_invites').select('*').eq('campaign_id', campaignId);

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Get an invite
 * @param inviteId - The invite to get
 * @returns The invite
 */
export async function getInvite(inviteId: string) {
  // Validate inputs
  z.string().uuid().parse(inviteId);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get the invite
  const { data, error } = await supabase
    .from('campaign_invites')
    .select(
      `
      *,
      campaign: campaigns!campaign_invites_campaign_id_fkey (
        name
      )
      `,
    )
    .eq('id', inviteId)
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Get the current user's invites
 * @returns The current user's invites
 */
export async function getUserInvites() {
  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get the current user's profile
  const { data: profile } = await getProfile();
  if (!profile) {
    return { error: 'User not found' };
  }

  // Get the invites
  const { data, error } = await supabase
    .from('campaign_invites')
    .select(
      `
      *,
      campaign: campaigns!campaign_invites_campaign_id_fkey (
        name
      )
      `,
    )
    .or(`user_id.eq.${profile.id},email.eq.${profile.email}`);

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Create an invite
 * @param campaign_id - The campaign to create an invite for
 * @param email - The email to invite
 * @returns The created invite
 */
export async function createInvite({ campaign_id, email }: z.infer<typeof validation.schemas.invites.createInvite>) {
  // Validate inputs
  validation.schemas.invites.createInvite.parse({ campaign_id, email });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get the current user's profile
  const { data: profile } = await getProfile();
  if (!profile) {
    return { error: 'User not found' };
  }

  // Check if an invite for this email already exists for this campaign
  const { data: existingInvite, error: existingInviteError } = await supabase
    .from('campaign_invites')
    .select('*')
    .eq('campaign_id', campaign_id)
    .eq('email', email);

  if (existingInviteError) {
    return { error: existingInviteError.message };
  }

  if (existingInvite?.length) {
    return { error: 'An invite for this email already exists for this campaign' };
  }

  // Check if the email is already a member of this campaign
  const { data: existingMembership } = await supabase
    .from('campaign_memberships')
    .select(
      `
      *,
      user: profiles!campaign_memberships_user_id_fkey (
        email
      )
    `,
    )
    .eq('campaign_id', campaign_id)
    .eq('user.email', email)
    .not('user', 'is', 'NULL');

  if (existingMembership?.length) {
    return { error: 'This email is already a member of this campaign' };
  }

  // Check if the email is already a user
  const { data: existingUser } = await supabase.from('profiles').select().eq('email', email).single();

  // Create the invite
  const { data, error } = await supabase
    .from('campaign_invites')
    .insert({ campaign_id, email, user_id: existingUser?.id })
    .select(
      `
      *,
      campaign: campaigns!campaign_invites_campaign_id_fkey (
        name
      )
      `,
    )
    .single();

  if (error) {
    return { error: error.message };
  }

  if (existingUser) {
    const supabaseAdmin = createAdminServerClient();
    const { data: generatedLink, error } = await supabaseAdmin.auth.admin.generateLink({ type: 'magiclink', email });

    if (error) {
      return { error: error.message };
    }

    const searchParams = new URLSearchParams({
      token_hash: generatedLink.properties.hashed_token,
      next: '/dashboard',
    });
    const link = `${config.HOST}/auth/sign-in/callback?${searchParams}`;

    await sendCampaignInviteExistingUserEmail({
      hostName: profile.name,
      inviteeName: existingUser.name.split(' ')[0]!,
      campaignName: data.campaign!.name,
      to: email,
      acceptInviteUrl: link,
    });
  } else {
    await sendCampaignInviteNewUserEmail({
      hostName: profile.name,
      campaignName: data.campaign!.name,
      to: email,
      signUpUrl: `${config.HOST}/auth/sign-up?token=${data.id}`,
    });
  }

  return { data };
}

/**
 * Delete an invite
 * @param id - The invite to delete
 */
export async function deleteInvite({ id }: z.infer<typeof validation.schemas.invites.deleteInvite>) {
  // Validate inputs
  validation.schemas.invites.deleteInvite.parse({ id });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Delete the invite
  const { error } = await supabase.from('campaign_invites').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }
}

/**
 * Accept an invite
 * @param inviteId - The invite to accept
 */
export async function acceptInvite({ id }: z.infer<typeof validation.schemas.invites.acceptInvite>) {
  // Validate inputs
  validation.schemas.invites.acceptInvite.parse({ id });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get the invite
  const { data: invite, error: inviteError } = await supabase.from('campaign_invites').select().eq('id', id).single();
  if (inviteError) {
    return { error: inviteError.message };
  }

  if (!invite) {
    return { error: 'Invite not found' };
  }

  // Get the current user's profile
  const { data: profile } = await getProfile();
  if (!profile) {
    return { error: 'User not found' };
  }

  // Create the membership
  const supabaseAdmin = createAdminServerClient();
  const { error } = await supabaseAdmin.from('campaign_memberships').insert({
    role: 'PLAYER',
    color: uniqolor(profile.id).color,
    campaign_id: invite.campaign_id,
    user_id: profile.id,
  });

  if (error) {
    return { error: error.message };
  }

  // Delete the invite
  await deleteInvite({ id });
}
