'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import { createServerClient } from '@/utils/supabase/server';

/**
 * Get a campaign's plugins
 * @param campaignId - The campaign to get plugins for
 * @returns The campaign's plugins
 */
export async function getCampaignPlugins(campaignId: string) {
  // Validate the campaign ID
  const schema = z.string().uuid();
  schema.parse(campaignId);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get the plugins
  const { data, error } = await supabase.from('plugins').select('*').eq('campaign_id', campaignId);

  if (error) {
    throw error;
  }

  return data;
}
