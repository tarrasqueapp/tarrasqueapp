import { Injectable, Logger } from '@nestjs/common';
import fs from 'fs-extra';
import { compile } from 'handlebars';
import mjml2html from 'mjml';
import nodemailer from 'nodemailer';
import path from 'path';

import { config } from '@tarrasque/common';

import { SendCampaignInviteEmailDto } from './dto/send-campaign-invite-email.dto';
import { SendEmailVerificationDto } from './dto/send-email-verification-email.dto';
import { SendPasswordResetEmailDto } from './dto/send-password-reset-email.dto';
import { SendTransactionalEmailDto } from './dto/send-transactional-email.dto';
import { SendWelcomeEmailDto } from './dto/send-welcome-email.dto';

@Injectable()
export class EmailService {
  private logger: Logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      auth: {
        user: config.SMTP_USERNAME,
        pass: config.SMTP_PASSWORD,
      },
    });
  }

  /**
   * Send an email
   * @param dto - email data
   * @returns sent email
   */
  async sendTransactionalEmail(dto: SendTransactionalEmailDto) {
    const options = {
      from: `Tarrasque App <${config.SMTP_FROM}>`,
      to: dto.to,
      subject: dto.subject,
      html: dto.html,
      // Add logo as attachment to enable inline display
      attachments: [
        {
          filename: 'logo.png',
          path: path.join('emails', 'logo.png'),
          cid: 'logo',
        },
      ],
    };
    return this.transporter.sendMail(options);
  }

  /**
   * Send an email verification email
   * @param dto - email verification email data
   * @returns sent email
   */
  async sendEmailVerificationEmail(dto: SendEmailVerificationDto) {
    this.logger.verbose(`📂 Sending email verification email to "${dto.to}"`);
    // Get contents of verify-email.mjml
    const mjml = await fs.readFile(path.join('emails', 'verify-email.mjml'), 'utf8');
    // Compile mjml with handlebars
    const template = compile(mjml);
    // Compile mjml to html
    const { html } = mjml2html(
      template({
        name: dto.name,
        verifyEmailUrl: `${config.HOST}/auth/verify-email?token=${dto.token}`,
      }),
    );
    // Send email
    const email = await this.sendTransactionalEmail({
      to: dto.to,
      subject: 'Verify new email address',
      html,
    });
    this.logger.verbose(`✅️ Sent email verification email to "${dto.to}"`);
    return email;
  }

  /**
   * Send a password reset email
   * @param dto - password reset email data
   * @returns sent email
   */
  async sendPasswordResetEmail(dto: SendPasswordResetEmailDto) {
    this.logger.verbose(`📂 Sending password reset email to "${dto.to}"`);
    // Get contents of reset-password.mjml
    const mjml = await fs.readFile(path.join('emails', 'reset-password.mjml'), 'utf8');
    // Compile mjml with handlebars
    const template = compile(mjml);
    // Compile mjml to html
    const { html } = mjml2html(
      template({
        name: dto.name,
        resetPasswordUrl: `${config.HOST}/auth/reset-password?token=${dto.token}`,
      }),
    );
    // Send email
    const email = await this.sendTransactionalEmail({
      to: dto.to,
      subject: 'Reset password',
      html,
    });
    this.logger.verbose(`✅️ Sent password reset email to "${dto.to}"`);
    return email;
  }

  /**
   * Send a campaign invite email for an existing user
   * @param dto - campaign invite email data
   * @returns sent email
   */
  async sendCampaignInviteExistingUserEmail(dto: SendCampaignInviteEmailDto) {
    this.logger.verbose(`📂 Sending campaign invite email to existing user "${dto.to}"`);
    // Get contents of campaign-invite-existing-user.mjml
    const mjml = await fs.readFile(path.join('emails', 'campaign-invite-existing-user.mjml'), 'utf8');
    // Compile mjml with handlebars
    const template = compile(mjml);
    // Compile mjml to html
    const { html } = mjml2html(
      template({
        hostName: dto.hostName,
        inviteeName: dto.inviteeName,
        campaignName: dto.campaignName,
        acceptInviteUrl: `${config.HOST}/dashboard/accept-invite?token=${dto.token}`,
      }),
    );
    // Send email
    const email = await this.sendTransactionalEmail({
      to: dto.to,
      subject: `${dto.hostName} invited you to ${dto.campaignName} on Tarrasque App`,
      html,
    });
    this.logger.verbose(`✅️ Sent campaign invite email to existing user "${dto.to}"`);
    return email;
  }

  /**
   * Send a campaign invite email for a new user
   * @param dto - campaign invite email data
   * @returns sent email
   */
  async sendCampaignInviteNewUserEmail(dto: SendCampaignInviteEmailDto) {
    this.logger.verbose(`📂 Sending campaign invite email to new user "${dto.to}"`);
    // Get contents of campaign-invite-new-user.mjml
    const mjml = await fs.readFile(path.join('emails', 'campaign-invite-new-user.mjml'), 'utf8');
    // Compile mjml with handlebars
    const template = compile(mjml);
    // Compile mjml to html
    const { html } = mjml2html(
      template({
        hostName: dto.hostName,
        campaignName: dto.campaignName,
        signUpUrl: `${config.HOST}/auth/sign-up?token=${dto.token}`,
      }),
    );
    // Send email
    const email = await this.sendTransactionalEmail({
      to: dto.to,
      subject: `${dto.hostName} invited you to ${dto.campaignName} on Tarrasque App`,
      html,
    });
    this.logger.verbose(`✅️ Sent campaign invite email to new user "${dto.to}"`);
    return email;
  }

  /**
   * Send a welcome email
   * @param dto - welcome email data
   * @returns sent email
   */
  async sendWelcomeEmail(dto: SendWelcomeEmailDto) {
    this.logger.verbose(`📂 Sending welcome email to "${dto.to}"`);
    // Get contents of welcome.mjml
    const mjml = await fs.readFile(path.join('emails', 'welcome.mjml'), 'utf8');
    // Compile mjml with handlebars
    const template = compile(mjml);
    // Compile mjml to html
    const { html } = mjml2html(
      template({
        name: dto.name,
        verifyEmailUrl: `${config.HOST}/auth/verify-email?token=${dto.token}`,
      }),
    );
    // Send email
    const email = await this.sendTransactionalEmail({
      to: dto.to,
      subject: 'Welcome to Tarrasque App',
      html,
    });
    this.logger.verbose(`✅️ Sent welcome email to "${dto.to}"`);
    return email;
  }
}
