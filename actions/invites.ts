'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import { createServerClient } from '@/utils/supabase/server';

export type Invite = Awaited<ReturnType<typeof getInvites>>[number];

/**
 * Get campaign's invites
 * @param campaignId - The campaign to get invites for
 * @returns The campaign's invites
 */
export async function getInvites(campaignId: string) {
  // Validate the campaign ID
  const schema = z.string().uuid();
  schema.parse(campaignId);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get the invites
  const { data, error } = await supabase.from('invites').select('*').eq('campaign_id', campaignId);

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Create an invite
 * @param campaign_id - The campaign to create an invite for
 * @param email - The email to invite
 * @returns The created invite
 */
export async function createInvite({ campaign_id, email }: { campaign_id: string; email: string }) {
  // Validate the campaign ID
  const schema = z.object({ campaign_id: z.string().uuid(), email: z.string().email().min(1) });
  schema.parse({ campaign_id, email });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Create the invite
  const { data, error } = await supabase.from('invites').insert({ campaign_id, email });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Delete an invite
 * @param inviteId - The invite to delete
 */
export async function deleteInvite(inviteId: string) {
  // Validate the invite ID
  const schema = z.string().uuid();
  schema.parse(inviteId);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Delete the invite
  const { error } = await supabase.from('invites').delete().eq('id', inviteId);

  if (error) {
    throw error;
  }
}
