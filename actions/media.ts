'use server';

import { z } from 'zod';

import { validation } from '@/lib/validation';
import { createServerClient } from '@/utils/supabase/server';

import { getUser } from './auth';

export type Media = NonNullable<Awaited<ReturnType<typeof createMedia>>['data']>;

/**
 * Create a media item
 * @param id - The media item's ID (must be the same as the object's ID)
 * @param url - The media item's URL
 * @param width - The media item's width
 * @param height - The media item's height
 * @param size - The media item's size
 * @returns The created media item
 */
export async function createMedia({
  id,
  url,
  width,
  height,
  size,
}: z.infer<typeof validation.schemas.media.createMedia>) {
  // Validate inputs
  validation.schemas.media.createMedia.parse({ id, url, width, height, size });

  // Connect to Supabase
  const supabase = createServerClient();

  // Get user
  const { data: user } = await getUser();
  if (!user) {
    return { error: 'User not found' };
  }

  // Create the media item
  const { data, error } = await supabase
    .from('media')
    .insert({ id, url, width, height, size, user_id: user.id })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}
