'use server';

import { UserAttributes } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { config } from '@/lib/config';
import { createAdminServerClient } from '@/utils/supabase/admin';
import { createServerClient } from '@/utils/supabase/server';

import { sendEmailVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from './email';
import { getProfile } from './profiles';

/**
 * Get the user details
 * @returns The user details
 */
export async function getUser() {
  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get user
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
 * Get the user session
 * @returns The session
 */
export async function getSession() {
  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get the session
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
 * Sign up the user with an email and password
 * @param name - The user's name
 * @param email - The user's email
 * @param password - The user's password
 */
export async function signUp({ name, email, password }: { name: string; email: string; password: string }) {
  // Validate the user details
  const schema = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(8) });
  schema.parse({ name, email, password });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createAdminServerClient(cookieStore);

  // Sign up the user and generate a verification link
  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'signup',
    email,
    password,
    options: {
      data: { name },
      redirectTo: `${config.HOST}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    throw error;
  }

  // Send the welcome email with the verification link
  const firstName = name.split(' ')[0];
  await sendWelcomeEmail({ firstName, to: email, verifyEmailUrl: data.properties.action_link });
}

/**
 * Sign in the user
 * @param email - The user's email
 * @param password - The user's password
 * @returns The user details
 */
export async function signIn({ email, password }: { email: string; password: string }) {
  // Validate the user details
  const schema = z.object({ email: z.string().email(), password: z.string().min(8) });
  schema.parse({ email, password });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Sign in the user
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign out the user
 */
export async function signOut() {
  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Sign out the user
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

/**
 * Update a user
 * @param email - The user's email
 * @param password - The user's password
 */
export async function updateUser({ email, password }: UserAttributes) {
  // Validate the user details
  const schema = z.object({ email: z.string().email().optional(), password: z.string().min(8).optional() });
  schema.parse({ email, password });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Get the user
  const user = await getUser();
  if (!user) {
    throw new Error('User not found');
  }

  // Update the user's email if it has been changed
  if (email && user.email && user.email !== email) {
    const supabaseAdmin = createAdminServerClient(cookieStore);

    // Change the user's email address and generate a verification link
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'email_change_new',
      email: user.email,
      newEmail: email,
      options: {
        redirectTo: `${config.HOST}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      throw error;
    }

    // Send an email with the verification link
    const profile = await getProfile();
    const firstName = profile!.name.split(' ')[0];
    await sendEmailVerificationEmail({ firstName, to: email, verifyEmailUrl: data.properties.action_link });
  }

  // Update the user's password if it has been changed
  if (password) {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      throw error;
    }
  }
}

/**
 * Send a reset password email to the user
 * @param email - The user's email
 */
export async function forgotPassword(email: string) {
  // Validate the user details
  const schema = z.object({ email: z.string().email() });
  schema.parse({ email });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createAdminServerClient(cookieStore);

  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: {
      redirectTo: `${config.HOST}/auth/callback?next=/auth/reset-password`,
    },
  });

  if (error) {
    throw error;
  }

  // Send the password reset email with the verification link
  const profile = await getProfile();
  const firstName = profile!.name.split(' ')[0];
  await sendPasswordResetEmail({ firstName, to: email, resetPasswordUrl: data.properties.action_link });
}
