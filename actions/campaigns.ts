'use server';

import { z } from 'zod';

import { Color } from '@/lib/colors';
import { validation } from '@/lib/validation';
import { createAdminServerClient } from '@/utils/supabase/admin';
import { createServerClient } from '@/utils/supabase/server';

import { getUser } from './auth';
import { CampaignMemberRole } from './memberships';

export type Campaign = NonNullable<Awaited<ReturnType<typeof getCampaign>>['data']>;

/**
 * Get a user's campaigns
 * @returns The user's campaigns
 */
export async function getUserCampaigns(role?: CampaignMemberRole) {
  // Validate inputs
  validation.fields.campaignMemberRole.optional().parse(role);

  // Connect to Supabase
  const supabase = createServerClient();

  // Get user
  const { data: user } = await getUser();
  if (!user) {
    return { error: 'User not found' };
  }

  // Get the user's campaign order
  const { data: profile } = await supabase.from('profiles').select('campaign_order').eq('id', user.id).single();
  const campaignOrder = (profile?.campaign_order as string[]) || [];

  // Get all memberships for the user and include the campaign data
  const query = supabase
    .from('campaign_memberships')
    .select(
      `
    campaign: campaigns!campaign_memberships_campaign_id_fkey (
      *
      )
      `,
    )
    .eq('user_id', user.id);

  // Filter by role if specified
  if (role) {
    query.eq('role', role);
  }

  const { data, error } = await query;

  const campaigns = data?.map((membership) => membership.campaign!) || [];

  // Sort the campaigns by the user's campaign order
  campaigns.sort((a, b) => {
    const aOrder = campaignOrder.findIndex((campaignId) => campaignId === a.id);
    const bOrder = campaignOrder.findIndex((campaignId) => campaignId === b.id);

    // If the user has no campaign order or the campaign is not in the order, sort by creation date
    if (aOrder === -1 || bOrder === -1) {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }

    // Sort by the user's campaign order
    return aOrder - bOrder;
  });

  if (error) {
    return { error: error.message };
  }

  return { data: campaigns };
}

/**
 * Get a campaign
 * @param campaignId - The campaign to get
 * @returns The campaign
 */
export async function getCampaign(campaignId: string) {
  // Validate inputs
  z.string().uuid().parse(campaignId);

  // Connect to Supabase
  const supabase = createServerClient();

  // Get the campaign
  const { data, error } = await supabase.from('campaigns').select(`*`).eq('id', campaignId).single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Create a campaign
 * @param name - The campaign's name
 * @returns The created campaign
 */
export async function createCampaign({ name }: z.infer<typeof validation.schemas.campaigns.createCampaign>) {
  // Validate inputs
  validation.schemas.campaigns.createCampaign.parse({ name });

  // Connect to Supabase
  const supabase = createServerClient();

  // Get user
  const { data: user } = await getUser();
  if (!user) {
    return { error: 'User not found' };
  }

  // Create the campaign
  const { data, error } = await supabase.from('campaigns').insert({ name, user_id: user.id }).select().single();

  if (error) {
    return { error: error.message };
  }

  // Add the user as a game master
  const supabaseAdmin = createAdminServerClient();
  await supabaseAdmin.from('campaign_memberships').insert({
    role: 'GAME_MASTER',
    color: Color.BLACK,
    campaign_id: data.id,
    user_id: user.id,
  });

  return { data };
}

/**
 * Update a campaign
 * @param id - The campaign to update
 * @param name - The campaign's name
 */
export async function updateCampaign({ id, name }: z.infer<typeof validation.schemas.campaigns.updateCampaign>) {
  // Validate inputs
  validation.schemas.campaigns.updateCampaign.parse({ id, name });

  // Connect to Supabase
  const supabase = createServerClient();

  // Update the campaign
  const { error } = await supabase.from('campaigns').update({ name }).eq('id', id);

  if (error) {
    return { error: error.message };
  }
}

/**
 * Delete a campaign
 * @param id - The campaign to delete
 */
export async function deleteCampaign({ id }: z.infer<typeof validation.schemas.campaigns.deleteCampaign>) {
  // Validate inputs
  validation.schemas.campaigns.deleteCampaign.parse({ id });

  // Connect to Supabase
  const supabase = createServerClient();

  // Delete the campaign
  const { error } = await supabase.from('campaigns').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }
}

/**
 * Reorder campaigns
 * @param campaignIds - The new order of campaign ids
 * @returns The reordered campaigns
 */
export async function reorderCampaigns({ campaignIds }: z.infer<typeof validation.schemas.campaigns.reorderCampaigns>) {
  // Validate inputs
  validation.schemas.campaigns.reorderCampaigns.parse({ campaignIds });

  // Connect to Supabase
  const supabase = createServerClient();

  // Get user
  const { data: user } = await getUser();
  if (!user) {
    return { error: 'User not found' };
  }

  // Update the user's campaign order
  const { error } = await supabase.from('profiles').update({ campaign_order: campaignIds }).eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  return { data: campaignIds };
}
