'use server';

import { z } from 'zod';

import { Color } from '@/utils/colors';
import { createAdminServerClient } from '@/utils/supabase/admin';
import { createServerClient } from '@/utils/supabase/server';
import { validation } from '@/utils/validation';

import { getUser } from './auth';

export type Campaign = NonNullable<Awaited<ReturnType<typeof getCampaign>>['data']>;

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
