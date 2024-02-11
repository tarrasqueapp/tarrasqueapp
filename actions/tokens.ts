'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import { createServerClient } from '@/utils/supabase/server';

/**
 * Get a map's tokens
 * @param mapId - The map to get tokens for
 * @returns The map's tokens
 */
export async function getMapTokens(mapId: string) {
  // Validate the map ID
  const schema = z.string().uuid();
  schema.parse(mapId);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get the tokens
  const { data, error } = await supabase.from('tokens').select('*').eq('map_id', mapId);

  if (error) {
    throw error;
  }

  return data;
}
