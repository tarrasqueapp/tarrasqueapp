import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

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
   * Register a new user
   */
  @Post('register')
  @ApiOkResponse({ type: UserEntity })
  register(@Body() data: CreateUserDto): Promise<UserEntity> {
    return this.usersService.createUser(data);
  }

  /**
   * Sign in with email and password
   */
  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({ type: UserEntity })
  async signIn(@Res({ passthrough: true }) res: Response, @User() user: UserEntity): Promise<UserEntity> {
    // Generate access and refresh tokens based on user
    const accessToken = this.authService.generateAccessToken(user.id);
    const refreshToken = this.authService.generateRefreshToken(user.id);
    // Set refresh token
    await this.usersService.setRefreshToken(user.id, refreshToken);
    // Set cookies
    res.cookie(config.JWT_ACCESS_TOKEN_NAME, accessToken, { httpOnly: true, signed: true, path: '/' });
    res.cookie(config.JWT_REFRESH_TOKEN_NAME, refreshToken, { httpOnly: true, signed: true, path: '/' });

    return user;
  }

  /**
   * Sign out the user
   */
  @Post('sign-out')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: null })
  async signOut(@Res({ passthrough: true }) res: Response, @User() user: UserEntity): Promise<void> {
    // Delete refresh token
    await this.usersService.removeRefreshToken(user.id);
    // Set cookies
    res.clearCookie(config.JWT_ACCESS_TOKEN_NAME);
    res.clearCookie(config.JWT_REFRESH_TOKEN_NAME);
  }

  /**
   * Return the user's profile
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  authenticate(@User() user: UserEntity): UserEntity {
    return user;
  }

  /**
   * Set new access token
   */
  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async refresh(@Res({ passthrough: true }) res: Response, @User() user: UserEntity): Promise<UserEntity> {
    // Generate access and refresh tokens based on user
    const accessToken = this.authService.generateAccessToken(user.id);
    const refreshToken = this.authService.generateRefreshToken(user.id);
    // Set refresh token
    await this.usersService.setRefreshToken(user.id, refreshToken);
    // Set cookies
    res.cookie(config.JWT_ACCESS_TOKEN_NAME, accessToken, { httpOnly: true, signed: true, path: '/' });
    res.cookie(config.JWT_REFRESH_TOKEN_NAME, refreshToken, { httpOnly: true, signed: true, path: '/' });
    return user;
  }
}
