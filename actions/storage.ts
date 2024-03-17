'use server';

import { z } from 'zod';

import { createServerClient } from '@/utils/supabase/server';
import { validation } from '@/utils/validation';

/**
 * Get a storage object's ID from the database
 * @param url - The URL of the storage object
 * @returns The storage object ID
 */
export async function getObjectId(url: string) {
  // Validate inputs
  z.string().min(1).parse(url);

  // Connect to Supabase
  const supabase = createServerClient();

  // Get the objects in the folder
  const folder = url.split('/')[0];
  const { data, error } = await supabase.storage.from('tarrasqueapp').list(folder);

  if (error) {
    return { error: error.message };
  }

  // Find the object with the specified name
  const file = url.split('/')[1];
  const object = data.find((obj) => obj.name === file);

  return { data: object?.id };
}

/**
 * Delete a storage object
 * @param url - The url of the storage object
 */
export async function deleteStorageObject({ url }: z.infer<typeof validation.schemas.storage.deleteStorageObject>) {
  // Validate inputs
  validation.schemas.storage.deleteStorageObject.parse({ url });

  // Connect to Supabase
  const supabase = createServerClient();

  // Delete the object
  const { error } = await supabase.storage.from('tarrasqueapp').remove([url]);

  if (error) {
    return { error: error.message };
  }
}
