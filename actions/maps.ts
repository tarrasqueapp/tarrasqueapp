'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import { createServerClient } from '@/utils/supabase/server';

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
