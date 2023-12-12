'use server';

import { UserAttributes } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import uniqolor from 'uniqolor';
import { z } from 'zod';

import { config } from '@/lib/config';
import { createAdminServerClient } from '@/utils/supabase/admin';
import { createServerClient } from '@/utils/supabase/server';

import { sendEmailVerificationEmail, sendMagicLinkEmail, sendWelcomeEmail } from './email';
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
 * Sign up the user with an email
 * @param name - The user's name
 * @param email - The user's email
 * @param token - The invite token
 */
export async function signUp({ name, email, token }: { name: string; email: string; token?: string }) {
  // Validate the user details
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    token: z.string().uuid().optional(),
  });
  schema.parse({ name, email, token });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Check if the user exists
  const { data: profile } = await supabase.from('profiles').select('id').eq('email', email).single();
  if (profile) {
    throw new Error('User already exists');
  }

  // Sign up the user and generate a verification link
  const supabaseAdmin = createAdminServerClient();
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: {
      data: {
        name,
      },
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
 * @returns The user details
 */
export async function signIn({ email }: { email: string }) {
  // Validate the user details
  const schema = z.object({ email: z.string().email() });
  schema.parse({ email });

  // Connect to Supabase
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Check if the user exists
  const { data: profile } = await supabase.from('profiles').select('name').eq('email', email).single();
  if (!profile) {
    throw new Error('User not found');
  }

  // Sign up the user and generate a verification link
  const supabaseAdmin = createAdminServerClient();
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });

  if (error) {
    throw error;
  }

  const searchParams = new URLSearchParams({
    token_hash: data.properties.hashed_token,
    next: '/dashboard',
  });
  const link = `${config.HOST}/auth/sign-in/callback?${searchParams}`;

  // Send the magic link email
  const firstName = profile.name.split(' ')[0]!;
  await sendMagicLinkEmail({ firstName, to: email, magicLinkUrl: link });
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
 */
export async function updateUser({ email }: UserAttributes) {
  // Validate the user details
  const schema = z.object({ email: z.string().email().optional() });
  schema.parse({ email });

  // Get the user
  const user = await getUser();
  if (!user) {
    throw new Error('User not found');
  }

  // Update the user's email if it has been changed
  if (email && user.email && user.email !== email) {
    // Change the user's email address and generate a verification link
    const supabaseAdmin = createAdminServerClient();
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
}
