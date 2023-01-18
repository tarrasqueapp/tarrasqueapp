import { Body, Controller, Get, Post, Put, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { CampaignInvitesService } from '../campaigns/campaign-invites.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { EmailService } from '../email/email.service';
import { EmailVerificationTokensService } from '../generic-tokens/email-verification-tokens.service';
import { PasswordResetTokensService } from '../generic-tokens/password-reset-tokens.service';
import { MediaService, ORIGINAL_FILENAME, THUMBNAIL_FILENAME } from '../media/media.service';
import { StorageService } from '../storage/storage.service';
import { User } from '../users/decorators/user.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly mediaService: MediaService,
    private readonly storageService: StorageService,
    private readonly emailVerificationTokensService: EmailVerificationTokensService,
    private readonly passwordResetTokensService: PasswordResetTokensService,
    private readonly campaignInvitesService: CampaignInvitesService,
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
      const token = await this.emailVerificationTokensService.createToken({ userId: user.id });
      // Send the email
      this.emailService.sendEmailVerificationEmail({ name: data.displayName, to: data.email, token: token.value });
      // Set the user as unverified
      data.emailVerified = false;
    }

    // Update the user
    return this.usersService.updateUser(user.id, data);
  }

  /**
   * Set new refresh token
   */
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @User() user: UserEntity,
  ): Promise<UserEntity> {
    // Get current refresh token
    const currentRefreshToken = req.signedCookies?.Refresh;
    // Generate access and refresh tokens based on user
    const accessToken = this.authService.generateAccessToken(user.id);
    const refreshToken = this.authService.generateRefreshToken(user.id);
    // Set refresh token
    await this.usersService.updateRefreshToken(currentRefreshToken, refreshToken);
    // Set cookies
    res.cookie('Access', accessToken, { httpOnly: true, signed: true, path: '/' });
    res.cookie('Refresh', refreshToken, { httpOnly: true, signed: true, path: '/' });
    return user;
  }

  /**
   * Check if the refresh token is valid
   */
  @UseGuards(JwtRefreshGuard)
  @Get('check-refresh-token')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async checkRefreshToken(@User() user: UserEntity): Promise<UserEntity> {
    return user;
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
    const token = await this.emailVerificationTokensService.createToken({ userId: user.id });
    // Send the email
    await this.emailService.sendEmailVerificationEmail({ name: user.displayName, to: user.email, token: token.value });
    // Assign existing campaign invites to the new user
    await this.campaignInvitesService.assignInvitesToUser(user.email, user.id);
  }

  /**
   * Sign in with email and password
   */
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @ApiOkResponse({ type: UserEntity })
  async signIn(@Res({ passthrough: true }) res: Response, @User() user: UserEntity): Promise<UserEntity> {
    if (!user.emailVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    // Generate access and refresh tokens based on user
    const accessToken = this.authService.generateAccessToken(user.id);
    const refreshToken = this.authService.generateRefreshToken(user.id);
    // Set refresh token
    await this.usersService.createRefreshToken(user.id, refreshToken);
    // Set cookies
    res.cookie('Access', accessToken, { httpOnly: true, signed: true, path: '/' });
    res.cookie('Refresh', refreshToken, { httpOnly: true, signed: true, path: '/' });

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
    // Get current refresh token
    const refreshToken = req.signedCookies?.Refresh;
    // Clear cookies
    res.clearCookie('Access');
    res.clearCookie('Refresh');
    // Delete refresh token
    this.usersService.removeRefreshToken(refreshToken);
  }

  /**
   * Verify the user's email
   */
  @Post('verify-email')
  @ApiOkResponse({ type: UserEntity })
  async verifyEmail(@Res({ passthrough: true }) res: Response, @Body() data: { token: string }): Promise<UserEntity> {
    // Decode the token
    const { userId } = await this.emailVerificationTokensService.getToken(data.token);
    // Update the user's emailVerified field
    const user = await this.usersService.updateUser(userId, { emailVerified: true });
    // Delete the token
    this.emailVerificationTokensService.deleteToken(data.token);
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
      const token = await this.passwordResetTokensService.createToken({ userId: user.id });
      // Send password reset email
      this.emailService.sendPasswordResetEmail({ name: user.displayName, to: user.email, token: token.value });
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
    await this.passwordResetTokensService.getToken(data.token);
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
    const { userId } = await this.passwordResetTokensService.getToken(data.token);
    // Update the user's password
    const user = await this.usersService.updateUser(userId, { password: data.password });
    // Delete the token
    this.passwordResetTokensService.deleteToken(data.token);
    // Sign in the user
    return await this.signIn(res, user);
  }
}
