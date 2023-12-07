'use server';

import { UserAttributes } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

import { createClient } from '../../utils/supabase/server';
import { Database } from '../../utils/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

/**
 * Get the user details
 * @returns The user details
 */
export async function getUser() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return user;
}

/**
 * Get the user profile
 * @returns The user profile
 */
export async function getProfile() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
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
    .limit(1);
  if (error) {
    throw error;
  }
  return data?.[0];
}

/**
 * Get the user session
 * @returns The session
 */
export async function getSession() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return session;
}

/**
 * Sign out the user
 */
export async function signOut() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

/**
 * Update a user
 * @param attributes - The user attributes to update
 * @returns The updated user
 */
export async function updateUser(attributes: UserAttributes) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.updateUser(attributes);
  if (error) {
    throw error;
  }
  return data.user;
}

/**
 * Update a user profile
 * @param profile - The user profile to update
 */
export async function updateProfile(profile: Partial<Profile>) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.from('profiles').update(profile).eq('id', profile.id!);
  if (error) {
    throw error;
  }
}
