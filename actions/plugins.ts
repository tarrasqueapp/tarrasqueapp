'use server';

import { z } from 'zod';

import { createServerClient } from '@/utils/supabase/server';
import { validation } from '@/utils/validation';

import { getUser } from './auth';

export type Plugin = NonNullable<Awaited<ReturnType<typeof getUserPlugins>>['data']>[number];
export type CampaignPlugin = NonNullable<Awaited<ReturnType<typeof getCampaignPlugins>>['data']>[number];

/**
 * Get a user's installed plugins
 * @returns The user's installed plugins
 */
export async function getUserPlugins() {
  // Connect to Supabase
  const supabase = createServerClient();

  // Get user
  const { data: user } = await getUser();
  if (!user) {
    return { error: 'User not found' };
  }

  // Get the plugins
  const { data, error } = await supabase.from('plugins').select('*').eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Install a plugin
 * @param manifest_url - The plugin's manifest URL
 */
export async function installPlugin({ manifest_url }: z.infer<typeof validation.schemas.plugins.installPlugin>) {
  // Validate inputs
  validation.schemas.plugins.installPlugin.parse({ manifest_url });

  // Connect to Supabase
  const supabase = createServerClient();

  // Get user
  const { data: user } = await getUser();
  if (!user) {
    return { error: 'User not found' };
  }

  // Create the plugin
  const { error } = await supabase.from('plugins').insert({ user_id: user.id, manifest_url });

  if (error) {
    return { error: error.message };
  }
}

/**
 * Uninstall a plugin
 * @param id - The plugin to uninstall
 */
export async function uninstallPlugin({ id }: z.infer<typeof validation.schemas.plugins.uninstallPlugin>) {
  // Validate inputs
  validation.schemas.plugins.uninstallPlugin.parse({ id });

  // Connect to Supabase
  const supabase = createServerClient();

  // Delete the plugin
  const { error } = await supabase.from('plugins').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }
}

/**
 * Get a campaign's plugins
 * @param campaignId - The campaign to get plugins for
 * @returns The campaign's plugins
 */
export async function getCampaignPlugins(campaignId: string) {
  // Validate inputs
  z.string().uuid().parse(campaignId);

  // Connect to Supabase
  const supabase = createServerClient();

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
    return { error: error.message };
  }

  return { data };
}

/**
 * Enable a plugin for a campaign
 * @param campaign_id - The campaign to enable the plugin for
 * @param plugin_id - The plugin to enable
 */
export async function enableCampaignPlugin({
  campaign_id,
  plugin_id,
}: z.infer<typeof validation.schemas.plugins.enableCampaignPlugin>) {
  // Validate inputs
  validation.schemas.plugins.enableCampaignPlugin.parse({ campaign_id, plugin_id });

  // Connect to Supabase
  const supabase = createServerClient();

  // Enable the plugin
  const { error } = await supabase.from('campaign_plugins').insert({ campaign_id, plugin_id });

  if (error) {
    return { error: error.message };
  }
}

/**
 * Disable a plugin for a campaign
 * @param id - The campaign plugin to disable
 */
export async function disableCampaignPlugin({ id }: z.infer<typeof validation.schemas.plugins.disableCampaignPlugin>) {
  // Validate inputs
  validation.schemas.plugins.disableCampaignPlugin.parse({ id });

  // Connect to Supabase
  const supabase = createServerClient();

  // Disable the plugin
  const { error } = await supabase.from('campaign_plugins').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }
}
