import { Injectable, Logger } from '@nestjs/common';
import fs from 'fs-extra';
import { compile } from 'handlebars';
import mjml2html from 'mjml';
import nodemailer from 'nodemailer';
import path from 'path';

import { config } from '../config';
import { SendEmailDto } from './dto/send-email.dto';
import { SendResetPasswordEmailDto } from './dto/send-reset-password-email.dto';
import { SendVerifyEmailDto } from './dto/send-verify-email.dto';
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
      from: config.SMTP_FROM,
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
   * Send a reset password email
   * @param sendResetPasswordEmailDto - reset password email data
   * @returns sent email
   */
  async sendResetPasswordEmail(sendResetPasswordEmailDto: SendResetPasswordEmailDto) {
    this.logger.verbose(`📂 Sending reset password email to "${sendResetPasswordEmailDto.to}"`);
    // Get contents of reset-password.mjml
    const mjml = await fs.readFile(path.join('emails', 'reset-password.mjml'), 'utf8');
    // Compile mjml with handlebars
    const template = compile(mjml);
    // Compile mjml to html
    const { html } = mjml2html(
      template({
        name: sendResetPasswordEmailDto.name,
        resetPasswordUrl: `${config.HOST}/auth/reset-password?token=${sendResetPasswordEmailDto.token}`,
      }),
    );
    // Send email
    const email = await this.sendEmail({
      to: sendResetPasswordEmailDto.to,
      subject: 'Reset password',
      html,
    });
    this.logger.verbose(`✅️ Sent reset password email to "${sendResetPasswordEmailDto.to}"`);
    return email;
  }

  /**
   * Send a verify email
   * @param sendVerifyEmailDto - verify email data
   * @returns sent email
   */
  async sendVerifyEmail(sendVerifyEmailDto: SendVerifyEmailDto) {
    this.logger.verbose(`📂 Sending verify email to "${sendVerifyEmailDto.to}"`);
    // Get contents of verify-email.mjml
    const mjml = await fs.readFile(path.join('emails', 'verify-email.mjml'), 'utf8');
    // Compile mjml with handlebars
    const template = compile(mjml);
    // Compile mjml to html
    const { html } = mjml2html(
      template({
        name: sendVerifyEmailDto.name,
        verifyUrl: `${config.HOST}/auth/verify-email?token=${sendVerifyEmailDto.token}`,
      }),
    );
    // Send email
    const email = await this.sendEmail({
      to: sendVerifyEmailDto.to,
      subject: 'Verify email',
      html,
    });
    this.logger.verbose(`✅️ Sent verify email to "${sendVerifyEmailDto.to}"`);
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
}
