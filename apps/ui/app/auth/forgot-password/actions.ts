'use server';

import { cookies } from 'next/headers';

import { config } from '@tarrasque/common';

import { createClient } from '../../../utils/supabase/server';

/**
 * Send a reset password email to the user
 * @param email - The user's email
 */
export async function forgotPassword(email: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${config.HOST}/auth/callback?next=/auth/reset-password`,
  });
  if (error) {
    throw error;
  }
}
