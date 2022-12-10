import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Request, Response } from 'express';

import { config } from '../config';
import { User } from '../users/decorators/user.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  /**
   * Return the user's profile
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  authenticate(@User() user: UserEntity): UserEntity {
    return user;
  }

  /**
   * Set new access token
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
    const currentRefreshToken = req.signedCookies?.[config.JWT_REFRESH_TOKEN_NAME];
    // Generate access and refresh tokens based on user
    const accessToken = this.authService.generateAccessToken(user.id);
    const refreshToken = this.authService.generateRefreshToken(user.id);
    // Set refresh token
    await this.usersService.updateRefreshToken(currentRefreshToken, refreshToken);
    // Set cookies
    res.cookie(config.JWT_ACCESS_TOKEN_NAME, accessToken, { httpOnly: true, signed: true, path: '/' });
    res.cookie(config.JWT_REFRESH_TOKEN_NAME, refreshToken, { httpOnly: true, signed: true, path: '/' });
    return user;
  }

  /**
   * Register a new user
   */
  @Post('register')
  @ApiOkResponse({ type: UserEntity })
  register(@Body() data: CreateUserDto): Promise<UserEntity> {
    return this.usersService.createUser({ ...data, roles: [Role.USER] });
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
    res.cookie(config.JWT_ACCESS_TOKEN_NAME, accessToken, { httpOnly: true, signed: true, path: '/' });
    res.cookie(config.JWT_REFRESH_TOKEN_NAME, refreshToken, { httpOnly: true, signed: true, path: '/' });

    return user;
  }

  /**
   * Sign out the user
   */
  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  @ApiBearerAuth()
  @ApiOkResponse({ type: null })
  async signOut(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    // Get current refresh token
    const refreshToken = req.signedCookies?.[config.JWT_REFRESH_TOKEN_NAME];
    // Set cookies
    res.clearCookie(config.JWT_ACCESS_TOKEN_NAME);
    res.clearCookie(config.JWT_REFRESH_TOKEN_NAME);
    // Delete refresh token
    this.usersService.removeRefreshToken(refreshToken);
  }
}
