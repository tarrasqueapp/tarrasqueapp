import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { CampaignBaseEntity } from 'src/campaigns/entities/campaign-base.entity';
import { CampaignRole, CampaignRoleGuard } from 'src/campaigns/guards/campaign-role.guard';
import { CreateMapDto } from 'src/maps/dto/create-map.dto';
import { MapBaseEntity } from 'src/maps/entities/map-base.entity';
import { RoleGuard } from 'src/users/guards/role.guard';

import { CampaignsService } from '../campaigns/campaigns.service';
import { CreateCampaignDto } from '../campaigns/dto/create-campaign.dto';
import { MapsService } from '../maps/maps.service';
import { User } from '../users/decorators/user.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { SetupDto } from './dto/setup.dto';
import { SetupGuard } from './guards/setup.guard';
import { SetupService } from './setup.service';

@Controller('setup')
export class SetupController {
  constructor(
    private readonly setupService: SetupService,
    private readonly usersService: UsersService,
    private readonly campaignsService: CampaignsService,
    private readonly mapsService: MapsService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Get the setup status
   */
  @Get()
  async getSetup(): Promise<SetupDto> {
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
    res.cookie('Authentication', accessToken, { httpOnly: true, signed: true, path: '/' });
    res.cookie('Refresh', refreshToken, { httpOnly: true, signed: true, path: '/' });
    return user;
  }

  /**
   * Create a campaign
   */
  @Post('create-campaign')
  @UseGuards(RoleGuard(Role.ADMIN))
  @UseGuards(SetupGuard)
  async createCampaign(@Body() data: CreateCampaignDto, @User() user: UserEntity): Promise<CampaignBaseEntity> {
    return this.campaignsService.createCampaign(data, user.id);
  }

  /**
   * Create a map
   */
  @Post('create-map')
  @UseGuards(CampaignRoleGuard(CampaignRole.OWNER))
  @UseGuards(RoleGuard(Role.ADMIN))
  @UseGuards(SetupGuard)
  async createMap(@Body() data: CreateMapDto, @User() user: UserEntity): Promise<MapBaseEntity> {
    return this.mapsService.createMap(data, user.id);
  }
}
