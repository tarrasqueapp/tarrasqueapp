'use server';

import { z } from 'zod';

import { createServerClient } from '@/utils/supabase/server';

export type Token = NonNullable<Awaited<ReturnType<typeof getMapTokens>>['data']>[number];

/**
 * Get a map's tokens
 * @param mapId - The map to get tokens for
 * @returns The map's tokens
 */
export async function getMapTokens(mapId: string) {
  // Validate inputs
  z.string().uuid().parse(mapId);

  // Connect to Supabase
  const supabase = createServerClient();

  // Get the tokens
  const { data, error } = await supabase.from('tokens').select('*').eq('map_id', mapId);

  if (error) {
    return { error: error.message };
  }

  return { data };
}
