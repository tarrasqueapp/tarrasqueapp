'use server';

import { cookies } from 'next/headers';

import { createClient } from '../../utils/supabase/server';
import { Database } from '../../utils/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

type CreateMediaDto = Omit<Database['public']['Tables']['media']['Insert'], 'user_id'>;

/**
 * Create a media item
 * @param dto - The media item to create
 */
export async function createMedia(dto: CreateMediaDto) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('media')
    .insert({ id: dto.id, url: dto.url, width: dto.width, height: dto.height, size: dto.size, user_id: user!.id })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get a storage object's ID from the database
 * @param url - The URL of the storage object
 * @returns The storage object ID
 */
export async function getObjectId(url: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const folder = url.split('/')[0];
  const file = url.split('/')[1];

  const { data, error } = await supabase.storage.from('tarrasqueapp').list(folder);

  if (error) {
    throw error;
  }

  // Find the object with the specified name
  const object = data.find((obj) => obj.name === file);

  return object?.id;
}

/**
 * Delete a storage object
 * @param url - The url of the storage object
 */
export async function deleteStorageObject(url: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.storage.from('tarrasqueapp').remove([url]);
  if (error) {
    throw error;
  }
}
