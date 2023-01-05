import { Body, Controller, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

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
  updateUser(@User() user: UserEntity, @Body() data: UpdateUserDto): Promise<UserEntity> {
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
  async check(@User() user: UserEntity): Promise<UserEntity> {
    return user;
  }

  /**
   * Register a new user
   */
  @Post('sign-up')
  @ApiOkResponse({ type: UserEntity })
  async signUp(@Res({ passthrough: true }) res: Response, @Body() data: CreateUserDto): Promise<UserEntity> {
    const user = await this.usersService.createUser(data);
    return await this.signIn(res, user);
  }

  /**
   * Sign in with email and password
   */
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @ApiOkResponse({ type: UserEntity })
  async signIn(@Res({ passthrough: true }) res: Response, @User() user: UserEntity): Promise<UserEntity> {
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
    // Set cookies
    res.clearCookie('Access');
    res.clearCookie('Refresh');
    // Delete refresh token
    this.usersService.removeRefreshToken(refreshToken);
  }
}
