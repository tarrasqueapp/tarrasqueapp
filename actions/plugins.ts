'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import { validate } from '@/lib/validate';
import { createServerClient } from '@/utils/supabase/server';

import { getUser } from './auth';

/**
 * Get a user's installed plugins
 * @returns The user's installed plugins
 */
export async function getUserPlugins() {
  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get user
  const user = await getUser();
  if (!user) {
    throw new Error('User not found');
  }

  // Get the plugins
  const { data, error } = await supabase.from('plugins').select('*').eq('user_id', user.id);

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Install a plugin
 * @param manifest_url - The plugin's manifest URL
 */
export async function installPlugin({ manifest_url }: { manifest_url: string }) {
  // Validate inputs
  const schema = z.object({
    manifest_url: validate.fields.manifestUrl,
  });
  schema.parse({ manifest_url });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get user
  const user = await getUser();
  if (!user) {
    throw new Error('User not found');
  }

  // Create the plugin
  const { error } = await supabase.from('plugins').insert({ user_id: user.id, manifest_url });

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
  const { data, error } = await supabase
    .from('campaign_plugins')
    .select(
      `
      *,
      plugin: plugins!campaign_plugins_plugin_id_fkey (
        *
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
 * Enable a plugin for a campaign
 * @param campaign_id - The campaign to enable the plugin for
 * @param plugin_id - The plugin to enable
 */
export async function enableCampaignPlugin({ campaign_id, plugin_id }: { campaign_id: string; plugin_id: string }) {
  // Validate inputs
  const schema = z.object({
    campaign_id: z.string().uuid(),
    plugin_id: z.string().uuid(),
  });
  schema.parse({ campaign_id, plugin_id });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Enable the plugin
  const { error } = await supabase.from('campaign_plugins').insert({ campaign_id, plugin_id });

  if (error) {
    throw error;
  }
}

/**
 * Disable a plugin for a campaign
 * @param campaignPluginId - The campaign plugin to disable
 */
export async function disableCampaignPlugin(campaignPluginId: string) {
  // Validate inputs
  const schema = z.string().uuid();
  schema.parse(campaignPluginId);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Disable the plugin
  const { error } = await supabase.from('campaign_plugins').delete().eq('id', campaignPluginId);

  if (error) {
    throw error;
  }
}
