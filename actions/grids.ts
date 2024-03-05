'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import { validate } from '@/lib/validate';
import { createServerClient } from '@/utils/supabase/server';
import { Enums } from '@/utils/supabase/types.gen';

import { getUser } from './auth';

export type Grid = Awaited<ReturnType<typeof getMapGrid>>;
export type GridType = Enums<'grid_type'>;

/**
 * Get a map's grid
 * @param mapId - The map to get the grid for
 * @returns The map's grid
 */
export async function getMapGrid(mapId: string) {
  // Validate the map ID
  const schema = z.string().uuid();
  schema.parse(mapId);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get the grid
  const { data, error } = await supabase.from('grids').select('*').eq('map_id', mapId).single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Create a map's grid
 * @param grid - The grid to create
 * @returns The created grid
 */
export async function createGrid(grid: Omit<Grid, 'id' | 'created_at' | 'user_id'>) {
  // Validate inputs
  const schema = z
    .object({
      type: validate.fields.gridType,
      width: z.number(),
      height: z.number(),
      offset_x: z.number(),
      offset_y: z.number(),
      color: z.string(),
      snap: z.boolean(),
      visible: z.boolean(),
      map_id: z.string().uuid(),
      campaign_id: z.string().uuid(),
    })
    .strict();
  grid = schema.parse(grid);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get user
  const user = await getUser();
  if (!user) {
    throw new Error('User not found');
  }

  // Create the grid
  const { data, error } = await supabase
    .from('grids')
    .insert({ ...grid, user_id: user.id })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Update a map's grid
 * @param grid - The grid to update
 */
export async function updateGrid(grid: Partial<Grid> & { id: string }) {
  // Validate inputs
  const schema = z.object({
    id: z.string().uuid(),
    type: validate.fields.gridType.optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    offset_x: z.number().optional(),
    offset_y: z.number().optional(),
    color: z.string().optional(),
    snap: z.boolean().optional(),
    visible: z.boolean().optional(),
    map_id: z.string().uuid().optional(),
  });
  grid = schema.parse(grid);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Update the grid
  const { error } = await supabase.from('grids').update(grid).eq('id', grid.id);

  if (error) {
    throw error;
  }
}
