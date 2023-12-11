'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import { validate } from '@/lib/validate';
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

/**
 * Install a plugin
 * @param campaign_id - The campaign to install the plugin for
 * @param manifest_url - The plugin's manifest URL
 */
export async function installPlugin({ campaign_id, manifest_url }: { campaign_id: string; manifest_url: string }) {
  // Validate inputs
  const schema = z.object({
    campaign_id: z.string().uuid(),
    manifest_url: validate.fields.manifestUrl,
  });
  schema.parse({ campaign_id, manifest_url });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Create the plugin
  const { error } = await supabase.from('plugins').insert({ campaign_id, manifest_url });

  if (error) {
    throw error;
  }
}

/**
 * Uninstall a plugin
 * @param pluginId - The plugin to uninstall
 */
export async function uninstallPlugin(pluginId: string) {
  // Validate inputs
  const schema = z.string().uuid();
  schema.parse(pluginId);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Delete the plugin
  const { error } = await supabase.from('plugins').delete().eq('id', pluginId);

  if (error) {
    throw error;
  }
}
