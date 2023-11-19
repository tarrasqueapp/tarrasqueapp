import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Put,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ActionTokenType, Prisma, Role } from '@prisma/client';
import { Response } from 'express';

import { ActionTokensService } from '../action-tokens/action-tokens.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { InvitesGateway } from '../campaigns/modules/invites/invites.gateway';
import { MembershipsService } from '../campaigns/modules/memberships/memberships.service';
import { EmailService } from '../email/email.service';
import { durationToDate } from '../helpers';
import { MapsService } from '../maps/maps.service';
import { MediaService, ORIGINAL_FILENAME, THUMBNAIL_FILENAME } from '../media/media.service';
import { StorageService } from '../storage/storage.service';
import { User } from '../users/decorators/user.decorator';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private actionTokensService: ActionTokensService,
    private emailService: EmailService,
    private membershipsService: MembershipsService,
    private mediaService: MediaService,
    private storageService: StorageService,
    private campaignsService: CampaignsService,
    private mapsService: MapsService,
    private invitesGateway: InvitesGateway,
  ) {}

  /**
   * Return the user's profile
   * @param user - The user object
   * @returns The user's profile
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiCookieAuth()
  @ApiOkResponse({ type: UserEntity })
  getUser(@User() user: UserEntity): UserEntity {
    return user;
  }

  /**
   * Register a new user
   * @param data - The user data
   */
  @Post('sign-up')
  @ApiOkResponse({ type: null })
  async signUp(@Body() data: SignUpDto): Promise<void> {
    const email = data.email.toLowerCase();

    // Check if the user's email is already taken
    const existingUser = await this.usersService.getUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    let user: UserEntity;

    if (!data.token) {
      // Create the user
      user = await this.usersService.createUser({
        name: data.name,
        email,
        password: data.password,
      });
    } else {
      // Get the invite
      const invite = await this.actionTokensService.getTokenById(data.token, ActionTokenType.INVITE);
      if (!invite) {
        throw new NotFoundException('Invalid or expired token');
      }

      // Check that the invite is for the correct email
      if (invite.email !== email) {
        throw new BadRequestException('Invite does not match provided email');
      }

      // Get the role from the token payload
      const payload = invite.payload as Prisma.JsonObject;
      const role = (payload?.role as Role) || Role.PLAYER;

      // Create the user
      user = await this.usersService.createUser({
        name: data.name,
        email,
        password: data.password,
      });

      // Assign the user to the campaign
      await this.membershipsService.createMembership({ userId: user.id, campaignId: invite.campaignId, role });

      // Delete the invite once used
      this.actionTokensService.deleteToken(invite.id);
      this.invitesGateway.deleteInvite(invite);
    }

    // Assign existing campaign invites to the new user
    await this.actionTokensService.assignTokensToUser(user.email, user.id);

    // Generate the verify email token
    const token = await this.actionTokensService.createToken({
      type: ActionTokenType.VERIFY_EMAIL,
      email: user.email,
      expiresAt: durationToDate('7d'),
      userId: user.id,
    });

    // Send the welcome email
    await this.emailService.sendWelcomeEmail({ name: user.name, to: user.email, token: token.id });
  }

  /**
   * Sign in with email and password
   * @param res - The response object
   * @param user - The user object
   * @returns The user object
   */
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @ApiOkResponse({ type: UserEntity })
  async signIn(@Res({ passthrough: true }) res: Response, @User() user: UserEntity): Promise<UserEntity> {
    // Check that the user's email is verified
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    // Generate access token for the user
    const accessToken = this.actionTokensService.generateToken(user.id);

    // Set cookies
    this.authService.setCookies(res, accessToken);

    return user;
  }

  /**
   * Sign out the user
   * @param res - The response object
   */
  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  @ApiCookieAuth()
  @ApiOkResponse({ type: null })
  signOut(@Res({ passthrough: true }) res: Response): void {
    // Clear cookies
    this.authService.clearCookies(res);
  }

  /**
   * Resend the email verification email to the user
   * @param data - The email data
   */
  @Post('resend-email-verification')
  @ApiOkResponse({ type: null })
  async resendEmailVerification(@Body() data: { email: string }): Promise<void> {
    // Get the user
    const email = data.email.toLowerCase();
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the user's email is verified
    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Get the token
    let [token] = await this.actionTokensService.getTokensByUserId(user.id, ActionTokenType.VERIFY_EMAIL);
    if (!token) {
      token = await this.actionTokensService.createToken({
        type: ActionTokenType.VERIFY_EMAIL,
        email: user.email,
        expiresAt: durationToDate('7d'),
        userId: user.id,
      });
    }

    // Send the email
    await this.emailService.sendEmailVerificationEmail({ name: user.displayName, to: user.email, token: token.id });
  }

  /**
   * Verify the user's email
   * @param res - The response object
   * @param data - The token data
   * @returns The user object
   */
  @Post('verify-email')
  @ApiOkResponse({ type: UserEntity })
  async verifyEmail(@Res({ passthrough: true }) res: Response, @Body() data: { token: string }): Promise<UserEntity> {
    // Decode the token
    const foundToken = await this.actionTokensService.getTokenById(data.token, ActionTokenType.VERIFY_EMAIL);
    if (!foundToken) {
      throw new NotFoundException('Invalid or expired token');
    }

    // Update the user's isEmailVerified field
    const user = await this.usersService.updateUser(foundToken.userId!, { isEmailVerified: true });

    // Delete the token
    try {
      this.actionTokensService.deleteToken(foundToken.id);
    } catch (error) {}

    // Create the user's first campaign
    const campaigns = await this.campaignsService.getCampaignsByUserId(user.id);
    if (campaigns.length === 0) {
      // Create a campaign for the user
      this.campaignsService.createCampaign({ name: `${user.displayName}'s Campaign`, createdById: user.id });
    }
    // Sign in the user
    return await this.signIn(res, user);
  }

  /**
   * Forgot password
   * @param data - The email data
   */
  @Post('forgot-password')
  @ApiOkResponse({ type: null })
  async forgotPassword(@Body() data: { email: string }): Promise<void> {
    // Get the user
    const email = data.email.toLowerCase();
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check that there is no existing reset password token
    const [foundToken] = await this.actionTokensService.getTokensByUserId(user.id, ActionTokenType.RESET_PASSWORD);
    if (foundToken) {
      throw new ConflictException('Token already exists');
    }

    // Create a token
    const token = await this.actionTokensService.createToken({
      type: ActionTokenType.RESET_PASSWORD,
      email: user.email,
      expiresAt: durationToDate('1d'),
      userId: user.id,
    });

    // Send password reset email
    this.emailService.sendPasswordResetEmail({ name: user.name, to: user.email, token: token.id });
  }

  /**
   * Change the user's password
   * @param res - The response object
   * @param data - The token data
   * @returns The user object
   */
  @Post('reset-password')
  @ApiOkResponse({ type: UserEntity })
  async resetPassword(
    @Res({ passthrough: true }) res: Response,
    @Body() data: { token: string; password: string },
  ): Promise<UserEntity> {
    // Decode the token
    const token = await this.actionTokensService.getTokenById(data.token, ActionTokenType.RESET_PASSWORD);
    if (!token) {
      throw new NotFoundException('Invalid or expired token');
    }

    // Update the user's password
    const user = await this.usersService.updateUser(token.userId, { password: data.password });

    // Delete the token
    try {
      this.actionTokensService.deleteToken(token.id);
    } catch (error) {}

    // Sign in the user
    return await this.signIn(res, user);
  }

  /**
   * Update the current user
   * @param user - The user object
   * @param data - The user data
   * @returns The updated user object
   */
  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiCookieAuth()
  @ApiOkResponse({ type: UserEntity })
  async updateUser(@User() user: UserEntity, @Body() data: UpdateUserDto): Promise<UserEntity> {
    // Check if the avatar has changed
    if (!data.avatarId && user.avatar) {
      // Delete the media item from the database and its files from the storage
      this.mediaService.deleteMedia(user.avatar.id);
      this.storageService.delete(
        `${this.storageService.uploadPath}/${user.id}/${user.avatar.id}/${ORIGINAL_FILENAME}.${user.avatar.extension}`,
      );
      this.storageService.delete(
        `${this.storageService.uploadPath}/${user.id}/${user.avatar.id}/${THUMBNAIL_FILENAME}`,
      );
      data.avatarId = null;
    }

    // Check if email has changed
    const email = data.email.toLowerCase();
    if (email && email !== user.email) {
      // Check if the email is already in use
      const existingUser = await this.usersService.getUserByEmail(email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      // Generate the verify email token
      const token = await this.actionTokensService.createToken({
        type: ActionTokenType.VERIFY_EMAIL,
        email,
        expiresAt: durationToDate('7d'),
        userId: user.id,
      });

      // Send the email
      const name = data.name || user.name;
      this.emailService.sendEmailVerificationEmail({ name, to: email, token: token.id });

      // Set the user as unverified
      data.isEmailVerified = false;
    }

    // Update the user
    return this.usersService.updateUser(user.id, data);
  }

  /**
   * Delete the user's account
   * @param res - The response object
   * @param user - The user object
   */
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUser(@Res({ passthrough: true }) res: Response, @User() user: UserEntity): Promise<void> {
    if (user.avatar) {
      // Delete the media item from the database and its files from the storage
      this.mediaService.deleteMedia(user.avatar.id);
      this.storageService.delete(
        `${this.storageService.uploadPath}/${user.id}/${user.avatar.id}/${ORIGINAL_FILENAME}.${user.avatar.extension}`,
      );
      this.storageService.delete(
        `${this.storageService.uploadPath}/${user.id}/${user.avatar.id}/${THUMBNAIL_FILENAME}`,
      );
    }

    // Delete the user's campaigns
    const campaigns = await this.campaignsService.getCampaignsCreatedByUserId(user.id);

    // Delete all campaigns and their maps and media items
    await Promise.all([
      campaigns.map(async (campaign) => {
        // Get every map for the campaign
        const maps = await this.mapsService.getCampaignMaps(campaign.id);

        // Delete all campaign maps and their media items
        await Promise.all(
          maps.map(async (map) => {
            // Delete the map from the database
            const deletedMap = await this.mapsService.deleteMap(map.id);

            // Loop through all media items and delete them if they are not used by any other map
            for (const media of deletedMap.media) {
              // Get all maps that use the media item
              const maps = await this.mapsService.getMapsWithMediaId(media.id);

              if (maps.length === 0) {
                // Delete the media item from the database and its files from the storage
                await Promise.all([
                  this.mediaService.deleteMedia(media.id),
                  this.storageService.delete(
                    `${this.storageService.uploadPath}/${media.createdById}/${media.id}/${ORIGINAL_FILENAME}.${media.extension}`,
                  ),
                  this.storageService.delete(
                    `${this.storageService.uploadPath}/${media.createdById}/${media.id}/${THUMBNAIL_FILENAME}`,
                  ),
                ]);
              }
            }

            // Return the deleted map
            return deletedMap;
          }),
        );

        // Delete the campaign
        return await this.campaignsService.deleteCampaign(campaign.id);
      }),
    ]);

    // Delete the user
    await this.usersService.deleteUser(user.id);

    // Clear cookies
    this.authService.clearCookies(res);
  }
}
