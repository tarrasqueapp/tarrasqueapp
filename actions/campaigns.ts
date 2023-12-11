'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import { createServerClient } from '@/utils/supabase/server';

import { getUser } from './auth';
import { CampaignMemberRole } from './memberships';

export type Campaign = Awaited<ReturnType<typeof getCampaign>>;

/**
 * Get a user's campaigns
 * @returns The user's campaigns
 */
export async function getUserCampaigns(role?: CampaignMemberRole) {
  // Validate the role
  const schema = z.enum(['GAME_MASTER', 'PLAYER']).optional();
  schema.parse(role);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get user
  const user = await getUser();
  if (!user) {
    throw new Error('User not found');
  }

  // Get the user's campaign order
  const { data: profile } = await supabase.from('profiles').select('campaign_order').eq('id', user.id).single();
  const campaignOrder = (profile?.campaign_order as string[]) || [];

  // Get all memberships for the user and include the campaign data
  const query = supabase
    .from('memberships')
    .select(
      `
    campaign: campaigns!memberships_campaign_id_fkey (
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
    throw error;
  }

  return campaigns;
}

/**
 * Get a campaign
 * @param campaignId - The campaign to get
 * @returns The campaign
 */
export async function getCampaign(campaignId: string) {
  // Validate the campaign ID
  const schema = z.string().uuid();
  schema.parse(campaignId);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get the campaign
  const { data, error } = await supabase.from('campaigns').select(`*`).eq('id', campaignId).single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Create a campaign
 * @param name - The campaign's name
 * @returns The campaign
 */
export async function createCampaign({ name }: { name: string }) {
  // Validate the data
  const schema = z.object({ name: z.string().min(1) });
  schema.parse({ name });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get user
  const user = await getUser();
  if (!user) {
    throw new Error('User not found');
  }

  // Create the campaign
  const { data, error } = await supabase.from('campaigns').insert({ name, user_id: user.id }).select().single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Update a campaign
 * @param id - The campaign to update
 * @param name - The campaign's name
 */
export async function updateCampaign({ id, name }: { id: string; name: string }) {
  // Validate the data
  const schema = z.object({ id: z.string().uuid(), name: z.string().min(1) });
  schema.parse({ id, name });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Update the campaign
  const { error } = await supabase.from('campaigns').update({ name }).eq('id', id);

  if (error) {
    throw error;
  }
}

/**
 * Delete a campaign
 * @param campaignId - The campaign to delete
 */
export async function deleteCampaign(campaignId: string) {
  // Validate the campaign ID
  const schema = z.string().uuid();
  schema.parse(campaignId);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Delete the campaign
  const { error } = await supabase.from('campaigns').delete().eq('id', campaignId);

  if (error) {
    throw error;
  }
}

/**
 * Reorder campaigns
 * @param campaignIds - The new order of campaign ids
 * @returns The reordered campaigns
 */
export async function reorderCampaigns(campaignIds: string[]) {
  // Validate the campaign IDs
  const schema = z.array(z.string().uuid());
  schema.parse(campaignIds);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get user
  const user = await getUser();
  if (!user) {
    throw new Error('User not found');
  }

  // Update the user's campaign order
  const { error } = await supabase.from('profiles').update({ campaign_order: campaignIds }).eq('id', user.id);

  if (error) {
    throw error;
  }

  return campaignIds;
}
