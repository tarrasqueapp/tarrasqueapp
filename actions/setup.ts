'use server';

import { z } from 'zod';

import { validation } from '@/lib/validation';
import { createServerClient } from '@/utils/supabase/server';
import { Enums } from '@/utils/supabase/types.gen';

export type SetupStep = Enums<'setup_step'>;

/**
 * Get the setup progress
 * @returns The setup progress
 */
export async function getSetup() {
  // Connect to Supabase
  const supabase = createServerClient();

  // Get the setup progress
  const { data, error } = await supabase.from('setup').select('step').single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Create the initial database
 */
export async function createDatabase() {
  // Connect to Supabase
  const supabase = createServerClient();

  // Create the database
  const { error } = await supabase.from('setup').insert({ id: 1, step: 'CREATED_DATABASE' });

  if (error) {
    return { error: error.message };
  }
}

/**
 * Update the setup progress
 * @param step - The step to set the setup progress to
 */
export async function updateSetup({ step }: z.infer<typeof validation.schemas.setup.updateSetup>) {
  // Validate inputs
  validation.schemas.setup.updateSetup.parse({ step });

  // Connect to Supabase
  const supabase = createServerClient();

  // Update the setup progress
  const { error } = await supabase.from('setup').update({ step }).eq('id', 1);

  if (error) {
    return { error: error.message };
  }
}
