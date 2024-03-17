'use server';

import { z } from 'zod';

import { createServerClient } from '@/utils/supabase/server';
import { validation } from '@/utils/validation';

import { getUser } from './auth';

export type Profile = NonNullable<Awaited<ReturnType<typeof getProfile>>['data']>;

/**
 * Get the user profile
 * @returns The user profile
 */
export async function getProfile() {
  // Connect to Supabase
  const supabase = createServerClient();

  const { data: user } = await getUser();
  if (!user) {
    return { error: 'User not found' };
  }

  // Get the user
  const { data, error } = await supabase
    .from('profiles')
    .select(
      `
      *,
      avatar: media!profiles_avatar_id_fkey (
        *
      )
    `,
    )
    .eq('id', user.id)
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Update a user profile
 * @param data - The data to update the profile with
 */
export async function updateProfile({ name, avatar_id }: z.infer<typeof validation.schemas.profiles.updateProfile>) {
  // Validate inputs
  validation.schemas.profiles.updateProfile.parse({ name, avatar_id });

  // Connect to Supabase
  const supabase = createServerClient();

  // Get the user
  const { data: user } = await getUser();
  if (!user) {
    return { error: 'User not found' };
  }

  // Update the profile
  const { error } = await supabase.from('profiles').update({ name, avatar_id }).eq('id', user.id);

  if (error) {
    return { error: error.message };
  }
}
