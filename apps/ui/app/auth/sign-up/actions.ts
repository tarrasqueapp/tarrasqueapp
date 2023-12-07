'use server';

import { cookies } from 'next/headers';

import { config } from '@tarrasque/common';

import { createClient } from '../../../utils/supabase/server';

interface SignUpDto {
  name: string;
  email: string;
  password: string;
}

/**
 * Sign up the user with an email and password
 * @param user - The user details
 */
export async function signUp(user: SignUpDto) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options: {
      emailRedirectTo: `${config.HOST}/auth/callback?next=/dashboard`,
      data: {
        name: user.name,
      },
    },
  });
  if (error) {
    throw error;
  }
  return data;
}
