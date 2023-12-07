'use server';

import { cookies } from 'next/headers';

import { createClient } from '../../../utils/supabase/server';

interface SignInDto {
  email: string;
  password: string;
}

/**
 * Sign in the user
 * @param user - The user details
 * @returns The user details
 */
export async function signIn(user: SignInDto) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: user.password,
  });
  if (error) {
    throw error;
  }
  return data;
}
