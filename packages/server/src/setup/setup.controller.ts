import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Response } from 'express';
import { PrismaService } from 'nestjs-prisma';

import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { SetupDto } from './dto/setup.dto';
import { SetupGuard } from './guards/setup.guard';
import { SetupService } from './setup.service';

@Controller('setup')
export class SetupController {
  constructor(
    private prisma: PrismaService,
    private readonly setupService: SetupService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Get the setup progress
   */
  @Get()
  async getSetup(@Res({ passthrough: true }) res: Response): Promise<SetupDto> {
    const setup = await this.setupService.getSetup();
    if (setup.user) {
      // Generate access and refresh tokens based on user
      const accessToken = this.authService.generateAccessToken(setup.user.id);
      const refreshToken = this.authService.generateRefreshToken(setup.user.id);
      // Set refresh token
      await this.usersService.setRefreshToken(setup.user.id, refreshToken);
      // Set cookies
      res.cookie(process.env.JWT_ACCESS_TOKEN_NAME, accessToken, { httpOnly: true, signed: true, path: '/' });
      res.cookie(process.env.JWT_REFRESH_TOKEN_NAME, refreshToken, { httpOnly: true, signed: true, path: '/' });
    }
    return setup;
  }

  /**
   * Reset the setup process
   */
  @Post('reset')
  @UseGuards(SetupGuard)
  async reset(@Res({ passthrough: true }) res: Response): Promise<SetupDto> {
    const setup = await this.setupService.getSetup();
    if (setup.user) {
      // Delete refresh token
      await this.usersService.removeRefreshToken(setup.user.id);
      // Set cookies
      res.clearCookie(process.env.JWT_ACCESS_TOKEN_NAME);
      res.clearCookie(process.env.JWT_REFRESH_TOKEN_NAME);
    }
    // Delete all users
    await this.prisma.user.deleteMany({});
    // Delete all campaigns
    await this.prisma.campaign.deleteMany({});
    // Delete all maps
    await this.prisma.map.deleteMany({});
    // Return setup
    return this.setupService.getSetup();
  }

  /**
   * Create the database
   */
  @Post('create-database')
  @UseGuards(SetupGuard)
  async createDatabase(): Promise<SetupDto> {
    await this.setupService.createDatabase();
    return this.setupService.getSetup();
  }

  /**
   * Create a user
   */
  @Post('create-user')
  @UseGuards(SetupGuard)
  async createUser(@Body() data: CreateUserDto, @Res({ passthrough: true }) res: Response): Promise<UserEntity> {
    const user = await this.usersService.createUserWithRoles({ ...data, roles: [Role.ADMIN, Role.USER] });
    // Generate access and refresh tokens based on user
    const accessToken = this.authService.generateAccessToken(user.id);
    const refreshToken = this.authService.generateRefreshToken(user.id);
    // Set refresh token
    await this.usersService.setRefreshToken(user.id, refreshToken);
    // Set cookies
    res.cookie(process.env.JWT_ACCESS_TOKEN_NAME, accessToken, { httpOnly: true, signed: true, path: '/' });
    res.cookie(process.env.JWT_REFRESH_TOKEN_NAME, refreshToken, { httpOnly: true, signed: true, path: '/' });
    return user;
  }
}
