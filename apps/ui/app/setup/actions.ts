'use server';

import { cookies } from 'next/headers';

import { createClient } from '../../utils/supabase/server';
import { Database } from '../../utils/supabase/types';

type SetupStep = Database['public']['Enums']['setup_step'];

/**
 * Get the setup progress
 * @returns The setup progress
 */
export async function getSetup() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.from('setup').select('step').single();
  return data;
}

/**
 * Create the initial database
 */
export async function createDatabase() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.from('setup').insert({ id: 1, step: 'CREATED_DATABASE' });
  if (error) {
    throw error;
  }
}

/**
 * Update the setup progress
 * @param setup - The setup to update with
 */
export async function updateSetup(step: SetupStep) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.from('setup').update({ step }).eq('id', 1);
  if (error) {
    throw error;
  }
}
