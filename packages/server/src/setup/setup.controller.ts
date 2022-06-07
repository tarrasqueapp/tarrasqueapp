import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Response } from 'express';
import { PrismaService } from 'nestjs-prisma';

import { AuthService } from '../auth/auth.service';
import { config } from '../config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { SetupDto } from './dto/setup.dto';
import { SetupGuard } from './guards/setup.guard';
import { SetupService } from './setup.service';

@ApiTags('setup')
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
  @ApiOkResponse({ type: SetupDto })
  getSetup(): Promise<SetupDto> {
    return this.setupService.getSetup();
  }

  /**
   * Reset the setup process
   */
  @Post('reset')
  @UseGuards(SetupGuard)
  @ApiOkResponse({ type: SetupDto })
  async reset(@Res({ passthrough: true }) res: Response): Promise<SetupDto> {
    const setup = await this.setupService.getSetup();
    if (setup.user) {
      // Delete refresh token
      await this.usersService.removeRefreshToken(setup.user.id);
      // Set cookies
      res.clearCookie(config.JWT_ACCESS_TOKEN_NAME);
      res.clearCookie(config.JWT_REFRESH_TOKEN_NAME);
    }
    // Delete all maps
    await this.prisma.map.deleteMany({});
    // Delete all campaigns
    await this.prisma.campaign.deleteMany({});
    // Delete all users
    await this.prisma.user.deleteMany({});
    // Return setup
    return this.setupService.getSetup();
  }

  /**
   * Create the database
   */
  @Post('create-database')
  @UseGuards(SetupGuard)
  @ApiOkResponse({ type: SetupDto })
  async createDatabase(): Promise<SetupDto> {
    await this.setupService.createDatabase();
    return this.setupService.getSetup();
  }

  /**
   * Create a user
   */
  @Post('create-user')
  @UseGuards(SetupGuard)
  @ApiOkResponse({ type: UserEntity })
  createUser(@Body() data: CreateUserDto): Promise<UserEntity> {
    return this.usersService.createUserWithRoles({ ...data, roles: [Role.ADMIN, Role.USER] });
  }
}
