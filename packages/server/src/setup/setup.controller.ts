import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { FastifyReply } from 'fastify';
import { AuthService } from 'src/auth/auth.service';
import { CampaignRole, CampaignRoleGuard } from 'src/campaigns/guards/campaign-role.guard';
import { CreateMapDto } from 'src/maps/dto/create-map.dto';
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
  async createUser(@Body() data: CreateUserDto, @Res({ passthrough: true }) res: FastifyReply): Promise<SetupDto> {
    const user = await this.authService.register(data);
    // Generate access and refresh tokens based on user
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user.id);
    const { cookie: refreshTokenCookie, token: refreshToken } = this.authService.getCookieWithJwtRefreshToken(user.id);
    // Set refresh token
    await this.usersService.setRefreshToken(user.id, refreshToken);
    // Set cookies
    res.header('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return this.setupService.getSetup();
  }

  /**
   * Create a campaign
   */
  @Post('create-campaign')
  @UseGuards(RoleGuard(Role.ADMIN))
  @UseGuards(SetupGuard)
  async createCampaign(@Body() data: CreateCampaignDto, @User() user: UserEntity): Promise<SetupDto> {
    await this.campaignsService.createCampaign(data, user.id);
    return this.setupService.getSetup();
  }

  /**
   * Create a map
   */
  @Post('create-map')
  @UseGuards(CampaignRoleGuard(CampaignRole.OWNER))
  @UseGuards(RoleGuard(Role.ADMIN))
  @UseGuards(SetupGuard)
  async createMap(@Body() data: CreateMapDto, @User() user: UserEntity): Promise<SetupDto> {
    await this.mapsService.createMap(data, user.id);
    return this.setupService.getSetup();
  }
}
