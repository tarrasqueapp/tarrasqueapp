'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import { validation } from '@/lib/validation';
import { createServerClient } from '@/utils/supabase/server';
import { Enums } from '@/utils/supabase/types.gen';

import { getUser } from './auth';

export type Grid = NonNullable<Awaited<ReturnType<typeof getMapGrid>>['data']>;
export type GridType = Enums<'grid_type'>;

/**
 * Get a map's grid
 * @param mapId - The map to get the grid for
 * @returns The map's grid
 */
export async function getMapGrid(mapId: string) {
  // Validate inputs
  z.string().uuid().parse(mapId);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get the grid
  const { data, error } = await supabase.from('grids').select('*').eq('map_id', mapId).single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Create a map's grid
 * @param grid - The grid to create
 * @returns The created grid
 */
export async function createGrid({
  type,
  width,
  height,
  offset_x,
  offset_y,
  color,
  snap,
  visible,
  map_id,
  campaign_id,
}: z.infer<typeof validation.schemas.grids.createGrid>) {
  // Validate inputs
  validation.schemas.grids.createGrid.parse({
    type,
    width,
    height,
    offset_x,
    offset_y,
    color,
    snap,
    visible,
    map_id,
    campaign_id,
  });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get user
  const { data: user } = await getUser();
  if (!user) {
    return { error: 'User not found' };
  }

  // Create the grid
  const { data, error } = await supabase
    .from('grids')
    .insert({ type, width, height, offset_x, offset_y, color, snap, visible, map_id, campaign_id, user_id: user.id })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Update a map's grid
 * @param grid - The grid to update
 */
export async function updateGrid({
  id,
  type,
  width,
  height,
  offset_x,
  offset_y,
  color,
  snap,
  visible,
  map_id,
}: z.infer<typeof validation.schemas.grids.updateGrid>) {
  // Validate inputs
  validation.schemas.grids.updateGrid.parse({
    id,
    type,
    width,
    height,
    offset_x,
    offset_y,
    color,
    snap,
    visible,
    map_id,
  });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Update the grid
  const { error } = await supabase
    .from('grids')
    .update({ id, type, width, height, offset_x, offset_y, color, snap, visible, map_id })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }
}
