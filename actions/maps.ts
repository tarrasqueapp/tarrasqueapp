'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import { createServerClient } from '@/utils/supabase/server';

import { getUser } from './auth';
import { getMapTokens } from './tokens';

export type Map = Awaited<ReturnType<typeof getMaps>>[number];

/**
 * Get a campaign's maps
 * @param campaignId - The campaign to get maps for
 * @returns The campaign's maps
 */
export async function getMaps(campaignId: string) {
  // Validate the campaign ID
  const schema = z.string().uuid();
  schema.parse(campaignId);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get the maps
  const { data, error } = await supabase
    .from('maps')
    .select(
      `
      *,
      media: media!maps_media_id_fkey (
        *
      )
      `,
    )
    .order('order')
    .eq('campaign_id', campaignId);

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get a map by ID
 * @param mapId - The map to get
 * @returns The map
 */
export async function getMap(mapId: string) {
  // Validate the map ID
  const schema = z.string().uuid();
  schema.parse(mapId);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get the map
  const { data, error } = await supabase
    .from('maps')
    .select(
      `
      *,
      media: media!maps_media_id_fkey (
        *
      )
      `,
    )
    .eq('id', mapId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Create a map
 * @param name - The map's name
 * @param campaign_id - The campaign to create the map for
 * @param media_id - The map's media ID
 * @returns The created map
 */
export async function createMap({
  name,
  campaign_id,
  media_id,
}: {
  name: string;
  campaign_id: string;
  media_id: string;
}) {
  // Validate inputs
  const schema = z.object({ name: z.string().min(1), campaign_id: z.string().uuid(), media_id: z.string().uuid() });
  schema.parse({ name, campaign_id, media_id });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get user
  const user = await getUser();
  if (!user) {
    throw new Error('User not found');
  }

  // Get the order of the last map, if one exists
  const { data: lastMap } = await supabase
    .from('maps')
    .select('order')
    .eq('campaign_id', campaign_id)
    .order('order', { ascending: false })
    .limit(1);

  const order = lastMap?.[0]?.order || 0;

  // Create the map
  const { data, error } = await supabase.from('maps').insert({
    name,
    campaign_id,
    media_id: media_id,
    user_id: user.id,
    order: order + 1,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Duplicate a map
 * @param mapId - The map to duplicate
 * @returns The duplicated map
 */
export async function duplicateMap(mapId: string) {
  // Validate inputs
  const schema = z.string().uuid();
  schema.parse(mapId);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get the original map
  const map = await getMap(mapId);

  // Get the order of the last map, if one exists
  const { data: lastMap } = await supabase
    .from('maps')
    .select('order')
    .eq('campaign_id', map.campaign_id)
    .order('order', { ascending: false })
    .limit(1);

  const order = lastMap?.[0]?.order || 0;

  // Create the duplicated map with the same name and media, but a new ID and tokens
  const { data, error } = await supabase
    .from('maps')
    .insert({
      name: `Copy of ${map.name}`,
      order: order + 1,
      media_id: map.media_id,
      campaign_id: map.campaign_id,
      user_id: map.user_id,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Get the original map's tokens
  const tokens = await getMapTokens(mapId);

  // Duplicate the map's tokens
  await supabase.from('tokens').insert(tokens.map((token) => ({ ...token, map_id: data.id })));

  return data;
}

/**
 * Update a map
 * @param id - The map to update
 * @param name - The map's name
 * @param campaign_id - The campaign to update the map for
 * @param media_id - The map's media ID
 * @returns The updated map
 */
export async function updateMap({
  id,
  name,
  campaign_id,
  media_id,
}: {
  id: string;
  name: string;
  campaign_id: string;
  media_id: string;
}) {
  // Validate inputs
  const schema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    campaign_id: z.string().uuid(),
    media_id: z.string().uuid(),
  });
  schema.parse({ id, name, campaign_id, media_id });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Update the map
  const { data, error } = await supabase.from('maps').update({ name, campaign_id, media_id }).eq('id', id);

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Delete a map
 * @param mapId - The map to delete
 */
export async function deleteMap(mapId: string) {
  // Validate inputs
  const schema = z.string().uuid();
  schema.parse(mapId);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Delete the map
  const { error } = await supabase.from('maps').delete().eq('id', mapId);

  if (error) {
    throw error;
  }
}

/**
 * Reorder maps
 * @param mapIds - The new order of map ids
 */
export async function reorderMaps({ campaignId, mapIds }: { campaignId: string; mapIds: string[] }) {
  // Validate inputs
  const schema = z.object({ campaignId: z.string().uuid(), mapIds: z.array(z.string().uuid()) });
  schema.parse({ campaignId, mapIds });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  for (let i = 0; i < mapIds.length; i++) {
    const mapId = mapIds[i]!;
    const newOrder = i + 1;

    // Update the order of the map
    const { error } = await supabase
      .from('maps')
      .update({ order: newOrder })
      .eq('id', mapId)
      .eq('campaign_id', campaignId);

    if (error) throw error;
  }
}
