'use server';

import { TurnstileServerValidationResponse } from '@marsidev/react-turnstile';
import uniqolor from 'uniqolor';
import { z } from 'zod';

import { config } from '@/utils/config';
import { createAdminServerClient } from '@/utils/supabase/admin';
import { createServerClient } from '@/utils/supabase/server';
import { validation } from '@/utils/validation';

import { sendEmailVerificationEmail, sendMagicLinkEmail, sendWelcomeEmail } from './email';
import { getProfile } from './profiles';

/**
 * Get the user details
 * @returns The user details
 */
export async function getUser() {
  // Connect to Supabase
  const supabase = createServerClient();

  // Get user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return { error: error.message };
  }

  return { data: user };
}

/**
 * Get the user session
 * @returns The session
 */
export async function getSession() {
  // Connect to Supabase
  const supabase = createServerClient();

  // Get the session
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    return { error: error.message };
  }

  return { data: session };
}

/**
 * Verify Turnstile token
 * @param turnstileToken - The Turnstile token
 * @returns The Turnstile token verification
 */
export async function verifyTurnstileToken(turnstileToken: string | null) {
  // Validate Turnstile token
  if (!config.TURNSTILE_ENABLED) {
    return;
  }

  if (!turnstileToken) {
    return { error: 'Please verify you are human.' };
  }

  // Validate Turnstile token
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: `secret=${encodeURIComponent(config.TURNSTILE_SECRET_KEY)}&response=${encodeURIComponent(turnstileToken)}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const data = (await response.json()) as TurnstileServerValidationResponse;
  if (!data.success) {
    return { error: data.messages?.join(', ') || 'Failed to verify Turnstile token' };
  }

  return { data };
}

/**
 * Sign up the user with an email
 * @param name - The user's name
 * @param email - The user's email
 * @param inviteId - The invite ID
 */
export async function signUp({
  name,
  email,
  inviteId,
  turnstileToken,
}: z.infer<typeof validation.schemas.auth.signUp>) {
  // Validate inputs
  validation.schemas.auth.signUp.parse({ name, email, inviteId, turnstileToken });

  // Verify Turnstile token
  const turnstileResponse = await verifyTurnstileToken(turnstileToken);
  if (turnstileResponse?.error) {
    return { error: turnstileResponse.error };
  }

  // Connect to Supabase
  const supabase = createServerClient();

  // Check if the user exists
  const { data: profile } = await supabase.from('profiles').select('id').eq('email', email).single();
  if (profile) {
    return { error: 'User already exists' };
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
    return { error: error.message };
  }

  const searchParams = new URLSearchParams({
    token_hash: data.properties.hashed_token,
    next: '/dashboard',
  });
  const link = `${config.SITE_URL}/auth/sign-up/callback?${searchParams}`;

  // Associate campaign invites for this email address with the new user
  supabase.from('campaign_invites').update({ user_id: data.user.id }).eq('email', email);

  // If the user signed up with a campaign invite ID, add them to the campaign
  if (inviteId) {
    // Get the invite
    const { data: invite } = await supabase.from('campaign_invites').select().eq('id', inviteId).single();

    if (invite) {
      // Delete the invite
      supabase.from('campaign_invites').delete().eq('id', inviteId);

      // Create the user's campaign membership
      const uniqueUserColor = uniqolor(data.user.id, { format: 'hex' });
      supabaseAdmin.from('campaign_memberships').insert({
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
 */
export async function signIn({ email }: z.infer<typeof validation.schemas.auth.signIn>) {
  // Validate inputs
  validation.schemas.auth.signIn.parse({ email });

  // Connect to Supabase
  const supabase = createServerClient();

  // Check if the user exists
  const { data: profile } = await supabase.from('profiles').select('name').eq('email', email).single();
  if (!profile) {
    return { error: 'User not found' };
  }

  // Sign up the user and generate a verification link
  const supabaseAdmin = createAdminServerClient();
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });

  if (error) {
    return { error: error.message };
  }

  const searchParams = new URLSearchParams({
    token_hash: data.properties.hashed_token,
    next: '/dashboard',
  });
  const link = `${config.SITE_URL}/auth/sign-in/callback?${searchParams}`;

  // Send the magic link email
  const firstName = profile.name.split(' ')[0]!;
  await sendMagicLinkEmail({ firstName, to: email, magicLinkUrl: link });
}

/**
 * Sign out the user
 */
export async function signOut() {
  // Connect to Supabase
  const supabase = createServerClient();

  // Sign out the user
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }
}

/**
 * Update a user
 * @param email - The user's email
 */
export async function updateUser({ email }: z.infer<typeof validation.schemas.auth.updateUser>) {
  // Validate inputs
  validation.schemas.auth.updateUser.parse({ email });

  // Get the user
  const { data: user } = await getUser();
  if (!user) {
    return { error: 'User not found' };
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
      return { error: error.message };
    }

    const searchParams = new URLSearchParams({
      token_hash: data.properties.hashed_token,
      next: '/dashboard',
    });
    const link = `${config.SITE_URL}/auth/change-email/callback?${searchParams}`;

    // Send an email with the verification link
    const { data: profile } = await getProfile();
    if (!profile) {
      return { error: 'Profile not found' };
    }

    const firstName = profile!.name.split(' ')[0]!;
    await sendEmailVerificationEmail({ firstName, to: email, verifyEmailUrl: link });
  }
}
