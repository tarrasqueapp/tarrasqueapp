'use server';

import { z } from 'zod';

import { createServerClient } from '@/utils/supabase/server';
import { validation } from '@/utils/validation';

import { getUser } from './auth';
import { createGrid } from './grids';
import { getMapTokens } from './tokens';

export type Map = NonNullable<Awaited<ReturnType<typeof getMap>>['data']>;

/**
 * Get a campaign's maps
 * @param campaignId - The campaign to get maps for
 * @returns The campaign's maps
 */
export async function getMaps(campaignId: string) {
  // Validate inputs
  z.string().uuid().parse(campaignId);

  // Connect to Supabase
  const supabase = createServerClient();

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
    return { error: error.message };
  }

  return { data };
}

/**
 * Get a map by ID
 * @param mapId - The map to get
 * @returns The map
 */
export async function getMap(mapId: string) {
  // Validate inputs
  z.string().uuid().parse(mapId);

  // Connect to Supabase
  const supabase = createServerClient();

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
    return { error: error.message };
  }

  return { data };
}

/**
 * Create a map
 * @param name - The map's name
 * @param campaign_id - The campaign to create the map for
 * @param media_id - The map's media ID
 * @returns The created map
 */
export async function createMap({ name, campaign_id, media_id }: z.infer<typeof validation.schemas.maps.createMap>) {
  // Validate inputs
  validation.schemas.maps.createMap.parse({ name, campaign_id, media_id });

  // Connect to Supabase
  const supabase = createServerClient();

  // Get user
  const { data: user } = await getUser();
  if (!user) {
    return { error: 'User not found' };
  }

  // Get the order of the last map, if one exists
  const { data: lastMap } = await supabase
    .from('maps')
    .select('order')
    .eq('campaign_id', campaign_id)
    .order('order', { ascending: false })
    .limit(1);

  const order = (lastMap?.[0]?.order || 0) + 1;

  // Create the map
  const { data, error } = await supabase
    .from('maps')
    .insert({
      name,
      campaign_id,
      media_id: media_id,
      user_id: user.id,
      order,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Create the map's grid
  const { error: gridError } = await createGrid({
    type: 'SQUARE',
    width: 70,
    height: 70,
    offset_x: 0,
    offset_y: 0,
    color: '#000000',
    snap: true,
    visible: true,
    map_id: data.id,
    campaign_id,
  });
  if (gridError) {
    return { error: gridError };
  }

  return { data };
}

/**
 * Duplicate a map
 * @param id - The map to duplicate
 * @returns The duplicated map
 */
export async function duplicateMap({ id }: z.infer<typeof validation.schemas.maps.duplicateMap>) {
  // Validate inputs
  validation.schemas.maps.duplicateMap.parse({ id });

  // Connect to Supabase
  const supabase = createServerClient();

  // Get the original map
  const { data: map } = await getMap(id);
  if (!map) {
    return { error: 'Map not found' };
  }

  // Get the order of the last map, if one exists
  const { data: lastMap } = await supabase
    .from('maps')
    .select('order')
    .eq('campaign_id', map.campaign_id)
    .order('order', { ascending: false })
    .limit(1);

  const order = (lastMap?.[0]?.order || 0) + 1;

  // Create the duplicated map with the same name and media, but a new ID and tokens
  const { data, error } = await supabase
    .from('maps')
    .insert({
      name: `Copy of ${map.name}`,
      order,
      media_id: map.media_id,
      campaign_id: map.campaign_id,
      user_id: map.user_id,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Get the original map's tokens
  const { data: tokens, error: tokensError } = await getMapTokens(id);
  if (!tokens) {
    return { error: tokensError };
  }

  // Duplicate the map's tokens
  await supabase.from('tokens').insert(tokens.map((token) => ({ ...token, map_id: data.id })));

  return { data };
}

/**
 * Update a map
 * @param id - The map to update
 * @param name - The map's name
 * @param visible - The map's visibility to campaign players
 * @param campaign_id - The campaign to update the map for
 * @param media_id - The map's media ID
 * @returns The updated map
 */
export async function updateMap({
  id,
  name,
  visible,
  campaign_id,
  media_id,
}: z.infer<typeof validation.schemas.maps.updateMap>) {
  // Validate inputs
  validation.schemas.maps.updateMap.parse({ id, name, visible, campaign_id, media_id });

  // Connect to Supabase
  const supabase = createServerClient();

  const { data: map } = await getMap(id);
  if (!map) {
    return { error: 'Map not found' };
  }

  // If the campaign ID is changing, update the map's order to be the last in the new campaign
  let order = map.order;
  if (campaign_id && campaign_id !== map.campaign_id) {
    const { data: lastMap } = await supabase
      .from('maps')
      .select('order')
      .eq('campaign_id', campaign_id)
      .order('order', { ascending: false })
      .limit(1);

    order = (lastMap?.[0]?.order || 0) + 1;
  }

  // Update the map
  const { data, error } = await supabase
    .from('maps')
    .update({ name, visible, order, campaign_id, media_id })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Delete a map
 * @param id - The map to delete
 */
export async function deleteMap({ id }: z.infer<typeof validation.schemas.maps.deleteMap>) {
  // Validate inputs
  validation.schemas.maps.deleteMap.parse({ id });

  // Connect to Supabase
  const supabase = createServerClient();

  // Delete the map
  const { error } = await supabase.from('maps').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }
}

/**
 * Reorder maps
 * @param campaignId - The campaign to reorder maps for
 * @param mapIds - The new order of map ids
 */
export async function reorderMaps({ campaignId, mapIds }: z.infer<typeof validation.schemas.maps.reorderMaps>) {
  // Validate inputs
  validation.schemas.maps.reorderMaps.parse({ campaignId, mapIds });

  // Connect to Supabase
  const supabase = createServerClient();

  for (let i = 0; i < mapIds.length; i++) {
    const mapId = mapIds[i]!;
    const newOrder = i + 1;

    // Update the order of the map
    const { error } = await supabase
      .from('maps')
      .update({ order: newOrder })
      .eq('id', mapId)
      .eq('campaign_id', campaignId);

    if (error) {
      return { error: error.message };
    }
  }
}
