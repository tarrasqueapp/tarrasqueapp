import { Injectable, Logger } from '@nestjs/common';
import fs from 'fs-extra';
import { compile } from 'handlebars';
import mjml2html from 'mjml';
import nodemailer from 'nodemailer';
import path from 'path';

import { config } from '../config';
import { SendCampaignInviteExistingUserEmailDto } from './dto/send-campaign-invite-existing-user-email.dto';
import { SendCampaignInviteNewUserEmailDto } from './dto/send-campaign-invite-new-user-email.dto';
import { SendEmailVerificationDto } from './dto/send-email-verification-email.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { SendPasswordResetEmailDto } from './dto/send-password-reset-email.dto';
import { SendWelcomeEmailDto } from './dto/send-welcome-email.dto';

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  auth: {
    user: config.SMTP_USERNAME,
    pass: config.SMTP_PASSWORD,
  },
});

@Injectable()
export class EmailService {
  private logger: Logger = new Logger(EmailService.name);

  /**
   * Send an email
   * @param sendEmailDto - email data
   * @returns sent email
   */
  async sendEmail(sendEmailDto: SendEmailDto) {
    const options = {
      from: `Tarrasque App <${config.SMTP_FROM}>`,
      to: sendEmailDto.to,
      subject: sendEmailDto.subject,
      html: sendEmailDto.html,
      // Add logo as attachment to enable inline display
      attachments: [
        {
          filename: 'logo.png',
          path: path.join('emails', 'logo.png'),
          cid: 'logo',
        },
      ],
    };
    return transporter.sendMail(options);
  }

  /**
   * Send a password reset email
   * @param sendPasswordResetEmailDto - password reset email data
   * @returns sent email
   */
  async sendPasswordResetEmail(sendPasswordResetEmailDto: SendPasswordResetEmailDto) {
    this.logger.verbose(`📂 Sending password reset email to "${sendPasswordResetEmailDto.to}"`);
    // Get contents of reset-password.mjml
    const mjml = await fs.readFile(path.join('emails', 'reset-password.mjml'), 'utf8');
    // Compile mjml with handlebars
    const template = compile(mjml);
    // Compile mjml to html
    const { html } = mjml2html(
      template({
        name: sendPasswordResetEmailDto.name,
        resetPasswordUrl: `${config.HOST}/auth/reset-password?token=${sendPasswordResetEmailDto.token}`,
      }),
    );
    // Send email
    const email = await this.sendEmail({
      to: sendPasswordResetEmailDto.to,
      subject: 'Reset password',
      html,
    });
    this.logger.verbose(`✅️ Sent password reset email to "${sendPasswordResetEmailDto.to}"`);
    return email;
  }

  /**
   * Send an email verification email
   * @param sendEmailVerificationDto - email verification email data
   * @returns sent email
   */
  async sendEmailVerificationEmail(sendEmailVerificationDto: SendEmailVerificationDto) {
    this.logger.verbose(`📂 Sending email verification email to "${sendEmailVerificationDto.to}"`);
    // Get contents of verify-email.mjml
    const mjml = await fs.readFile(path.join('emails', 'verify-email.mjml'), 'utf8');
    // Compile mjml with handlebars
    const template = compile(mjml);
    // Compile mjml to html
    const { html } = mjml2html(
      template({
        name: sendEmailVerificationDto.name,
        verifyEmailUrl: `${config.HOST}/auth/verify-email?token=${sendEmailVerificationDto.token}`,
      }),
    );
    // Send email
    const email = await this.sendEmail({
      to: sendEmailVerificationDto.to,
      subject: 'Verify email',
      html,
    });
    this.logger.verbose(`✅️ Sent email verification email to "${sendEmailVerificationDto.to}"`);
    return email;
  }

  /**
   * Send a welcome email
   * @param sendWelcomeEmailDto - welcome email data
   * @returns sent email
   */
  async sendWelcomeEmail(sendWelcomeEmailDto: SendWelcomeEmailDto) {
    this.logger.verbose(`📂 Sending welcome email to "${sendWelcomeEmailDto.to}"`);
    // Get contents of welcome.mjml
    const mjml = await fs.readFile(path.join('emails', 'welcome.mjml'), 'utf8');
    // Compile mjml with handlebars
    const template = compile(mjml);
    // Compile mjml to html
    const { html } = mjml2html(
      template({
        name: sendWelcomeEmailDto.name,
        dashboardUrl: `${config.HOST}/dashboard`,
      }),
    );
    // Send email
    const email = await this.sendEmail({
      to: sendWelcomeEmailDto.to,
      subject: 'Welcome to Tarrasque App',
      html,
    });
    this.logger.verbose(`✅️ Sent welcome email to "${sendWelcomeEmailDto.to}"`);
    return email;
  }

  /**
   * Send a campaign invite email for a new user
   * @param dto - campaign invite email data
   * @returns sent email
   */
  async sendCampaignInviteNewUserEmail(dto: SendCampaignInviteNewUserEmailDto) {
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
        signUpUrl: `${config.HOST}/auth/sign-up?email=${dto.to}`,
      }),
    );
    // Send email
    const email = await this.sendEmail({
      to: dto.to,
      subject: `${dto.hostName} invited you to ${dto.campaignName} on Tarrasque App`,
      html,
    });
    this.logger.verbose(`✅️ Sent campaign invite email to new user "${dto.to}"`);
    return email;
  }

  /**
   * Send a campaign invite email for an existing user
   * @param dto - campaign invite email data
   * @returns sent email
   */
  async sendCampaignInviteExistingUserEmail(dto: SendCampaignInviteExistingUserEmailDto) {
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
        joinCampaignUrl: `${config.HOST}/dashboard?notifications`,
      }),
    );
    // Send email
    const email = await this.sendEmail({
      to: dto.to,
      subject: `${dto.hostName} invited you to ${dto.campaignName} on Tarrasque App`,
      html,
    });
    this.logger.verbose(`✅️ Sent campaign invite email to existing user "${dto.to}"`);
    return email;
  }
}
