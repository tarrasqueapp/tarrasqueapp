'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import { createServerClient } from '@/utils/supabase/server';
import { Database } from '@/utils/supabase/types.gen';

import { getUser } from './auth';

export type Media = Awaited<ReturnType<typeof createMedia>>;
type CreateMediaDto = Omit<Database['public']['Tables']['media']['Insert'], 'user_id'>;

/**
 * Create a media item
 * @param id - The media item's ID (must be the same as the object's ID)
 * @param url - The media item's URL
 * @param width - The media item's width
 * @param height - The media item's height
 * @param size - The media item's size
 * @returns The created media item
 */
export async function createMedia({ id, url, width, height, size }: CreateMediaDto) {
  // Validate the media item
  const schema = z.object({
    id: z.string().uuid(),
    url: z.string(),
    width: z.number(),
    height: z.number(),
    size: z.number(),
  });
  schema.parse({ id, url, width, height, size });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get user
  const user = await getUser();
  if (!user) {
    throw new Error('User not found');
  }

  // Create the media item
  const { data, error } = await supabase
    .from('media')
    .insert({ id, url, width, height, size, user_id: user.id })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
