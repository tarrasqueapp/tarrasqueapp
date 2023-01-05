import { Body, Controller, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { PrismaService } from 'nestjs-prisma';

import { UsersService } from '../users/users.service';
import { SetupDto } from './dto/setup.dto';
import { SetupGuard } from './guards/setup.guard';
import { SetupStep } from './setup-step.enum';
import { SetupService } from './setup.service';

@ApiTags('setup')
@Controller('setup')
export class SetupController {
  constructor(
    private prisma: PrismaService,
    private readonly setupService: SetupService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Get the setup progress
   */
  @Get()
  @ApiOkResponse({ type: SetupDto })
  getSetup(): Promise<SetupDto> {
    return this.setupService.getSetup();
  }

  @UseGuards(SetupGuard)
  @Put()
  @ApiOkResponse({ type: SetupDto })
  updateSetup(@Body() data: Partial<SetupDto>): Promise<SetupDto> {
    return this.setupService.updateSetup(data);
  }

  /**
   * Create the database
   */
  @UseGuards(SetupGuard)
  @Post('create-database')
  @ApiOkResponse({ type: null })
  async createDatabase(): Promise<void> {
    await this.setupService.createDatabase();
    await this.setupService.createSetup();
  }

  /**
   * Reset the setup process
   */
  @UseGuards(SetupGuard)
  @Post('reset')
  @ApiOkResponse({ type: SetupDto })
  async reset(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<SetupDto> {
    const setup = await this.setupService.getSetup();
    if (setup.step > SetupStep.USER) {
      // Get current refresh token
      const refreshToken = req.signedCookies?.Refresh;
      // Delete refresh token
      await this.usersService.removeRefreshToken(refreshToken);
      // Set cookies
      res.clearCookie('Access');
      res.clearCookie('Refresh');
    }

    // Delete all media
    await this.prisma.media.deleteMany({});
    // Delete all maps
    await this.prisma.map.deleteMany({});
    // Delete all campaigns
    await this.prisma.campaign.deleteMany({});
    // Delete all refresh tokens
    await this.prisma.refreshToken.deleteMany({});
    // Delete all users
    await this.prisma.user.deleteMany({});
    // Update setup
    return this.setupService.updateSetup({ step: SetupStep.USER, completed: false });
  }
}
