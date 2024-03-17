import { logger } from '@tarrasque/sdk';
import { compile } from 'handlebars';
import mjml2html from 'mjml';
import { readFile } from 'node:fs/promises';
import * as nodemailer from 'nodemailer';
import { resolve } from 'path';
import { cache } from 'react';
import { z } from 'zod';

import { config } from '@/utils/config';
import { validation } from '@/utils/validation';

const getTransporter = cache(async () => {
  // Use ethereal.email for development environment to avoid sending real emails
  if (config.NODE_ENV === 'development') {
    // Generate a test account using ethereal.email
    const account = await nodemailer.createTestAccount();

    // Use the test account to create a transporter
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
  }

  // Use the configured SMTP settings for production environment to send emails
  return nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: false,
    auth: {
      user: config.SMTP_USERNAME,
      pass: config.SMTP_PASSWORD,
    },
  });
});

/**
 * Send an email
 * @param to - The recipient's email address
 * @param subject - The email's subject
 * @param html - The email's HTML content
 * @returns The sent email
 */
async function sendTransactionalEmail({
  to,
  subject,
  html,
}: z.infer<typeof validation.schemas.email.sendTransactionalEmail>) {
  // Validate inputs
  validation.schemas.email.sendTransactionalEmail.parse({ to, subject, html });

  const options = {
    from: `Tarrasque App <${config.SMTP_FROM}>`,
    to,
    subject,
    html,
    // Add logo as attachment to enable inline display
    attachments: [
      {
        filename: 'logo.png',
        path: resolve('public', 'images', 'logo.png'),
        cid: 'logo',
      },
    ],
  };

  const transporter = await getTransporter();
  const email = await transporter.sendMail(options);

  // Log email preview url in development
  if (config.NODE_ENV === 'development') {
    logger.box('Email Preview URL:', nodemailer.getTestMessageUrl(email));
  }
}

/**
 * Send a welcome email
 * @param firstName - The user's first name
 * @param to - The user's email address
 * @param verifyEmailUrl - The url to verify the user's email address
 */
export async function sendWelcomeEmail({
  firstName,
  to,
  verifyEmailUrl,
}: z.infer<typeof validation.schemas.email.sendWelcomeEmail>) {
  // Validate inputs
  validation.schemas.email.sendWelcomeEmail.parse({ firstName, to, verifyEmailUrl });

  // Get contents of email template and compile variables with handlebars
  const mjml = await readFile(resolve('emails', 'welcome.mjml'), 'utf8');
  const { html: htmlFile } = mjml2html(mjml);
  const template = compile(htmlFile);
  const html = template({ firstName, verifyEmailUrl });

  // Send email
  await sendTransactionalEmail({ to, subject: 'Welcome to Tarrasque App', html });
}

/**
 * Send an email verification email
 * @param firstName - The user's first name
 * @param to - The user's email address
 * @param verifyEmailUrl - The url to verify the user's email address
 */
export async function sendEmailVerificationEmail({
  firstName,
  to,
  verifyEmailUrl,
}: z.infer<typeof validation.schemas.email.sendEmailVerificationEmail>) {
  // Validate inputs
  validation.schemas.email.sendEmailVerificationEmail.parse({ firstName, to, verifyEmailUrl });

  // Get contents of email template and compile variables with handlebars
  const mjml = await readFile(resolve('emails', 'verify-email.mjml'), 'utf8');
  const { html: htmlFile } = mjml2html(mjml);
  const template = compile(htmlFile);
  const html = template({ firstName, verifyEmailUrl });

  // Send email
  await sendTransactionalEmail({ to, subject: 'Verify new email address', html });
}

/**
 * Send a campaign invite email for a new user
 * @param hostName - The host's name
 * @param campaignName - The campaign's name
 * @param to - The invitee's email address
 * @param signUpUrl - The url to sign up
 */
export async function sendCampaignInviteNewUserEmail({
  hostName,
  campaignName,
  to,
  signUpUrl,
}: z.infer<typeof validation.schemas.email.sendCampaignInviteNewUserEmail>) {
  // Validate inputs
  validation.schemas.email.sendCampaignInviteNewUserEmail.parse({ hostName, campaignName, to, signUpUrl });

  // Get contents of email template and compile variables with handlebars
  const mjml = await readFile(resolve('emails', 'campaign-invite-new-user.mjml'), 'utf8');
  const { html: htmlFile } = mjml2html(mjml);
  const template = compile(htmlFile);
  const html = template({ hostName, campaignName, signUpUrl });

  // Send email
  await sendTransactionalEmail({
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
 */
export async function sendCampaignInviteExistingUserEmail({
  hostName,
  inviteeName,
  campaignName,
  to,
  acceptInviteUrl,
}: z.infer<typeof validation.schemas.email.sendCampaignInviteExistingUserEmail>) {
  // Validate inputs
  validation.schemas.email.sendCampaignInviteExistingUserEmail.parse({
    hostName,
    inviteeName,
    campaignName,
    to,
    acceptInviteUrl,
  });

  // Get contents of email template and compile variables with handlebars
  const mjml = await readFile(resolve('emails', 'campaign-invite-existing-user.mjml'), 'utf8');
  const { html: htmlFile } = mjml2html(mjml);
  const template = compile(htmlFile);
  const html = template({ hostName, inviteeName, campaignName, acceptInviteUrl });

  // Send email
  await sendTransactionalEmail({
    to,
    subject: `${hostName} invited you to ${campaignName} on Tarrasque App`,
    html,
  });
}

/**
 * Send magic link email
 * @param to - The user's email address
 * @param magicLinkUrl - The url to sign in
 */
export async function sendMagicLinkEmail({
  firstName,
  to,
  magicLinkUrl,
}: z.infer<typeof validation.schemas.email.sendMagicLinkEmail>) {
  // Validate inputs
  validation.schemas.email.sendMagicLinkEmail.parse({ firstName, to, magicLinkUrl });

  // Get contents of email template and compile variables with handlebars
  const mjml = await readFile(resolve('emails', 'magic-link.mjml'), 'utf8');
  const { html: htmlFile } = mjml2html(mjml);
  const template = compile(htmlFile);
  const html = template({ firstName, magicLinkUrl });

  // Send email
  await sendTransactionalEmail({ to, subject: 'Sign in to Tarrasque App', html });
}
