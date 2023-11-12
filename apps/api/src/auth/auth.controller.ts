import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ActionTokenType } from '@prisma/client';
import { Request, Response } from 'express';

import { ActionTokensService } from '../action-tokens/action-tokens.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { EmailService } from '../email/email.service';
import { durationToDate } from '../helpers';
import { MediaService, ORIGINAL_FILENAME, THUMBNAIL_FILENAME } from '../media/media.service';
import { StorageService } from '../storage/storage.service';
import { User } from '../users/decorators/user.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly mediaService: MediaService,
    private readonly storageService: StorageService,
    private readonly actionTokensService: ActionTokensService,
    private readonly emailService: EmailService,
    private readonly campaignsService: CampaignsService,
  ) {}

  /**
   * Return the user's profile
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  getUser(@User() user: UserEntity): UserEntity {
    return user;
  }

  /**
   * Update the current user
   */
  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async updateUser(@User() user: UserEntity, @Body() data: UpdateUserDto): Promise<UserEntity> {
    if (!data.avatarId && user.avatar) {
      // Delete the media item from the database and its files from the storage
      this.mediaService.deleteMedia(user.avatar.id);
      this.storageService.delete(
        `${this.storageService.uploadPath}/${user.id}/${user.avatar.id}/${ORIGINAL_FILENAME}.${user.avatar.extension}`,
      );
      this.storageService.delete(
        `${this.storageService.uploadPath}/${user.id}/${user.avatar.id}/${THUMBNAIL_FILENAME}`,
      );
    }

    // Check if email has changed
    if (data.email !== user.email) {
      // Generate the verify email token
      const token = await this.actionTokensService.createToken({
        type: ActionTokenType.VERIFY_EMAIL,
        email: data.email,
        userId: user.id,
        expiresAt: durationToDate('7d'),
      });
      // Send the email
      this.emailService.sendEmailVerificationEmail({ name: data.displayName, to: data.email, token: token.id });
      // Set the user as unverified
      data.isEmailVerified = false;
    }

    // Update the user
    return this.usersService.updateUser(user.id, data);
  }

  /**
   * Register a new user
   */
  @Post('sign-up')
  @ApiOkResponse({ type: null })
  async signUp(@Body() data: CreateUserDto): Promise<void> {
    // Create the user
    const user = await this.usersService.createUser(data);
    // Generate the verify email token
    const token = await this.actionTokensService.createToken({
      type: ActionTokenType.VERIFY_EMAIL,
      email: user.email,
      userId: user.id,
      expiresAt: durationToDate('7d'),
    });
    // Send the email
    await this.emailService.sendEmailVerificationEmail({ name: user.displayName, to: user.email, token: token.id });
    // Assign existing campaign invites to the new user
    await this.actionTokensService.assignTokensToUser(user.email, user.id);
  }

  /**
   * Sign in with email and password
   */
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @ApiOkResponse({ type: UserEntity })
  async signIn(@Res({ passthrough: true }) res: Response, @User() user: UserEntity): Promise<UserEntity> {
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    // Generate access token based on user
    const accessToken = this.actionTokensService.generateToken(user.id);
    // Set cookies
    res.cookie('Access', accessToken, { httpOnly: true, signed: true, path: '/' });

    return user;
  }

  /**
   * Sign out the user
   */
  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  @ApiBearerAuth()
  @ApiOkResponse({ type: null })
  signOut(@Req() req: Request, @Res({ passthrough: true }) res: Response): void {
    // Clear cookies
    res.clearCookie('Access');
  }

  /**
   * Resend the email verification email to the user
   */
  @Post('resend-email-verification')
  @ApiOkResponse({ type: null })
  async resendEmailVerification(@Body() data: { email: string }): Promise<void> {
    // Get the user
    const user = await this.usersService.getUserByEmail(data.email);
    // Check if the user's email is verified
    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }
    // Get the token
    const [token] = await this.actionTokensService.getTokensByUserId(user.id, ActionTokenType.VERIFY_EMAIL);
    // Send the email
    await this.emailService.sendEmailVerificationEmail({ name: user.displayName, to: user.email, token: token.id });
  }

  /**
   * Verify the user's email
   */
  @Post('verify-email')
  @ApiOkResponse({ type: UserEntity })
  async verifyEmail(@Res({ passthrough: true }) res: Response, @Body() data: { token: string }): Promise<UserEntity> {
    // Decode the token
    const { userId } = await this.actionTokensService.getTokenById(data.token);
    // Update the user's isEmailVerified field
    const user = await this.usersService.updateUser(userId, { isEmailVerified: true });
    // Delete the token
    this.actionTokensService.deleteToken(data.token);
    // Check if this is a new user or an existing user who has changed their email by checking if they have a campaign
    const campaigns = await this.campaignsService.getUserCampaigns(user.id);
    if (campaigns.length === 0) {
      // Send the welcome email
      this.emailService.sendWelcomeEmail({ name: user.displayName, to: user.email });
      // Create a campaign for the user
      this.campaignsService.createCampaign({ name: `${user.displayName}'s Campaign` }, user.id);
    }
    // Sign in the user
    return await this.signIn(res, user);
  }

  /**
   * Forgot password
   */
  @Post('forgot-password')
  @ApiOkResponse({ type: null })
  async forgotPassword(@Body() data: { email: string }): Promise<void> {
    try {
      // Get the user
      const user = await this.usersService.getUserByEmail(data.email);
      // Create a token
      const token = await this.actionTokensService.createToken({
        type: ActionTokenType.RESET_PASSWORD,
        email: user.email,
        userId: user.id,
        expiresAt: durationToDate('1d'),
      });
      // Send password reset email
      this.emailService.sendPasswordResetEmail({ name: user.displayName, to: user.email, token: token.id });
    } catch (e) {
      // Ignore the error if the user doesn't exist
    }
  }

  /**
   * Check if the password reset token is valid
   */
  @Post('check-password-reset-token')
  @ApiOkResponse({ type: null })
  async checkPasswordResetToken(@Body() data: { token: string }): Promise<void> {
    await this.actionTokensService.getTokenById(data.token);
  }

  /**
   * Change the user's password
   */
  @Post('reset-password')
  @ApiOkResponse({ type: UserEntity })
  async resetPassword(
    @Res({ passthrough: true }) res: Response,
    @Body() data: { token: string; password: string },
  ): Promise<UserEntity> {
    // Decode the token
    const { userId } = await this.actionTokensService.getTokenById(data.token);
    // Update the user's password
    const user = await this.usersService.updateUser(userId, { password: data.password });
    // Delete the token
    this.actionTokensService.deleteToken(data.token);
    // Sign in the user
    return await this.signIn(res, user);
  }
}
