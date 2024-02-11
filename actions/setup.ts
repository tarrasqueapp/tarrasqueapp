'use server';

import { cookies } from 'next/headers';

import { validate } from '@/lib/validate';
import { createServerClient } from '@/utils/supabase/server';
import { Enums } from '@/utils/supabase/types.gen';

export type SetupStep = Enums<'setup_step'>;

/**
 * Get the setup progress
 * @returns The setup progress
 */
export async function getSetup() {
  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get the setup progress
  const { data } = await supabase.from('setup').select('step').single();

  return data;
}

/**
 * Create the initial database
 */
export async function createDatabase() {
  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Create the database
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
  // Validate the data
  const schema = validate.fields.setupStep;
  schema.parse(step);

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Update the setup progress
  const { error } = await supabase.from('setup').update({ step }).eq('id', 1);

  if (error) {
    throw error;
  }
}
