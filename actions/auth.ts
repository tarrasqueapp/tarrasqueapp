'use server';

import { UserAttributes } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import uniqolor from 'uniqolor';
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
 * @param token - The invite token
 */
export async function signUp({
  name,
  email,
  password,
  token,
}: {
  name: string;
  email: string;
  password: string;
  token?: string;
}) {
  // Validate the user details
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    token: z.string().uuid().optional(),
  });
  schema.parse({ name, email, password, token });

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
    },
  });

  if (error) {
    throw error;
  }

  const searchParams = new URLSearchParams({
    token_hash: data.properties.hashed_token,
    next: '/dashboard',
  });
  const link = `${config.HOST}/auth/sign-up/callback?${searchParams}`;

  // Associate invites for this email address with the new user
  supabase.from('invites').update({ user_id: data.user.id }).eq('email', email);

  // If the user signed up with an invite token, add them to the campaign
  if (token) {
    // Get the invite
    const { data: invite } = await supabase.from('invites').select().eq('id', token).single();

    if (invite) {
      // Delete the invite
      supabase.from('invites').delete().eq('id', token);

      // Create the user's campaign membership
      const uniqueUserColor = uniqolor(data.user.id, { format: 'hex' });
      supabase.from('memberships').insert({
        role: 'PLAYER',
        color: uniqueUserColor.color,
        user_id: data.user.id,
        campaign_id: invite.campaign_id,
      });
    }
  }

  // Send the welcome email with the verification link
  const firstName = name.split(' ')[0]!;
  await sendWelcomeEmail({ firstName, to: email, verifyEmailUrl: link });
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
    });

    if (error) {
      throw error;
    }

    const searchParams = new URLSearchParams({
      token_hash: data.properties.hashed_token,
      next: '/dashboard',
    });
    const link = `${config.HOST}/auth/change-email/callback?${searchParams}`;

    // Send an email with the verification link
    const profile = await getProfile();
    const firstName = profile!.name.split(' ')[0]!;
    await sendEmailVerificationEmail({ firstName, to: email, verifyEmailUrl: link });
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

  const { data, error } = await supabase.auth.admin.generateLink({ type: 'recovery', email });

  if (error) {
    throw error;
  }

  const searchParams = new URLSearchParams({
    token_hash: data.properties.hashed_token,
    next: '/auth/reset-password',
  });
  const link = `${config.HOST}/auth/forgot-password/callback?${searchParams}`;

  // Send the password reset email with the verification link
  const { data: profile } = await supabase.from('profiles').select('name').eq('email', email).single();
  const firstName = profile!.name.split(' ')[0]!;
  await sendPasswordResetEmail({ firstName, to: email, resetPasswordUrl: link });
}
