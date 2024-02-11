'use server';

import { compile } from 'handlebars';
import { readFile } from 'node:fs/promises';
import * as nodemailer from 'nodemailer';
import { join } from 'path';
import { z } from 'zod';

import { config } from '@/lib/config';

let transporter: nodemailer.Transporter;

// Create transporter based on environment
if (config.NODE_ENV === 'development') {
  nodemailer.createTestAccount((err, account) => {
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
  });
} else {
  transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: false,
    auth: {
      user: config.SMTP_USERNAME,
      pass: config.SMTP_PASSWORD,
    },
  });
}

/**
 * Send an email
 * @param dto - email data
 * @returns The sent email
 */
async function sendTransactionalEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const options = {
    from: `Tarrasque App <${config.SMTP_FROM}>`,
    to,
    subject,
    html,
    // Add logo as attachment to enable inline display
    attachments: [
      {
        filename: 'logo.png',
        path: join('emails', 'logo.png'),
        cid: 'logo',
      },
    ],
  };

  const email = await transporter.sendMail(options);

  // Log email preview url in development
  if (config.NODE_ENV === 'development') {
    console.info();
    console.info('📧 Email Preview URL:', nodemailer.getTestMessageUrl(email));
    console.info();
  }
}

/**
 * Send a welcome email
 * @param firstName - The user's first name
 * @param to - The user's email address
 * @param verifyEmailUrl - The url to verify the user's email address
 * @returns The sent email
 */
export async function sendWelcomeEmail({
  firstName,
  to,
  verifyEmailUrl,
}: {
  firstName: string;
  to: string;
  verifyEmailUrl: string;
}) {
  // Validate inputs
  const schema = z.object({ firstName: z.string().min(1), to: z.string().email(), verifyEmailUrl: z.string().url() });
  schema.parse({ firstName, to, verifyEmailUrl });

  // Get contents of email template and compile variables with handlebars
  const file = await readFile(join('emails', 'welcome.html'), 'utf8');
  const template = compile(file);
  const html = template({ firstName, verifyEmailUrl });

  // Send email
  return await sendTransactionalEmail({ to, subject: 'Welcome to Tarrasque App', html });
}

/**
 * Send an email verification email
 * @param firstName - The user's first name
 * @param to - The user's email address
 * @param verifyEmailUrl - The url to verify the user's email address
 * @returns The sent email
 */
export async function sendEmailVerificationEmail({
  firstName,
  to,
  verifyEmailUrl,
}: {
  firstName: string;
  to: string;
  verifyEmailUrl: string;
}) {
  // Validate inputs
  const schema = z.object({ firstName: z.string().min(1), to: z.string().email(), verifyEmailUrl: z.string().url() });
  schema.parse({ firstName, to, verifyEmailUrl });

  // Get contents of email template and compile variables with handlebars
  const file = await readFile(join('emails', 'verify-email.html'), 'utf8');
  const template = compile(file);
  const html = template({ firstName, verifyEmailUrl });

  // Send email
  return await sendTransactionalEmail({ to, subject: 'Verify new email address', html });
}

/**
 * Send a campaign invite email for a new user
 * @param hostName - The host's name
 * @param campaignName - The campaign's name
 * @param to - The invitee's email address
 * @param signUpUrl - The url to sign up
 * @returns The sent email
 */
export async function sendCampaignInviteNewUserEmail({
  hostName,
  campaignName,
  to,
  signUpUrl,
}: {
  hostName: string;
  campaignName: string;
  to: string;
  signUpUrl: string;
}) {
  // Validate inputs
  const schema = z.object({
    hostName: z.string().min(1),
    campaignName: z.string().min(1),
    to: z.string().email(),
    signUpUrl: z.string().url(),
  });
  schema.parse({ hostName, campaignName, to, signUpUrl });

  // Get contents of email template and compile variables with handlebars
  const file = await readFile(join('emails', 'campaign-invite-new-user.html'), 'utf8');
  const template = compile(file);
  const html = template({ hostName, campaignName, signUpUrl });

  // Send email
  return await sendTransactionalEmail({
    to,
    subject: `${hostName} invited you to ${campaignName} on Tarrasque App`,
    html,
  });
}

/**
 * Send a campaign invite email for an existing user
 * @param hostName - The host's name
 * @param inviteeName - The invitee's name
 * @param campaignName - The campaign's name
 * @param to - The invitee's email address
 * @param acceptInviteUrl - The url to accept the invite
 * @returns The sent email
 */
export async function sendCampaignInviteExistingUserEmail({
  hostName,
  inviteeName,
  campaignName,
  to,
  acceptInviteUrl,
}: {
  hostName: string;
  inviteeName: string;
  campaignName: string;
  to: string;
  acceptInviteUrl: string;
}) {
  // Validate inputs
  const schema = z.object({
    hostName: z.string().min(1),
    inviteeName: z.string().min(1),
    campaignName: z.string().min(1),
    to: z.string().email(),
    acceptInviteUrl: z.string().url(),
  });
  schema.parse({ hostName, inviteeName, campaignName, to, acceptInviteUrl });

  // Get contents of email template and compile variables with handlebars
  const file = await readFile(join('emails', 'campaign-invite-existing-user.html'), 'utf8');
  const template = compile(file);
  const html = template({ hostName, inviteeName, campaignName, acceptInviteUrl });

  // Send email
  return await sendTransactionalEmail({
    to,
    subject: `${hostName} invited you to ${campaignName} on Tarrasque App`,
    html,
  });
}

/**
 * Send magic link email
 * @param to - The user's email address
 * @param magicLinkUrl - The url to sign in
 * @returns The sent email
 */
export async function sendMagicLinkEmail({
  firstName,
  to,
  magicLinkUrl,
}: {
  firstName: string;
  to: string;
  magicLinkUrl: string;
}) {
  // Validate inputs
  const schema = z.object({ firstName: z.string().min(1), to: z.string().email(), magicLinkUrl: z.string().url() });
  schema.parse({ firstName, to, magicLinkUrl });

  // Get contents of email template and compile variables with handlebars
  const file = await readFile(join('emails', 'magic-link.html'), 'utf8');
  const template = compile(file);
  const html = template({ firstName, magicLinkUrl });

  // Send email
  return await sendTransactionalEmail({ to, subject: 'Sign in to Tarrasque App', html });
}
