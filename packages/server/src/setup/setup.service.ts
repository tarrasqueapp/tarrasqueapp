import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import execa from 'execa';

import { CampaignsService } from '../campaigns/campaigns.service';
import { MapsService } from '../maps/maps.service';
import { UsersService } from '../users/users.service';
import { SetupDto } from './dto/setup.dto';

@Injectable()
export class SetupService {
  private logger: Logger = new Logger(SetupService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly campaignsService: CampaignsService,
    private readonly mapsService: MapsService,
  ) {}

  async getSetup(): Promise<SetupDto> {
    const dto = new SetupDto();
    try {
      // Get user count
      const users = await this.usersService.getUsers();
      dto.database = true;
      dto.user = users[0] || null;
      // Get campaign count
      if (dto.user) {
        const campaigns = await this.campaignsService.getUserCampaigns(dto.user.id);
        dto.campaign = campaigns[0] || null;
      }
      // Get map count
      if (dto.campaign) {
        const maps = await this.mapsService.getCampaignMaps(dto.campaign.id);
        dto.map = maps[0] || null;
      }
      // Set completed flag
      if (dto.user && dto.campaign && dto.map) {
        dto.completed = true;
      }
      // Return result
      return dto;
    } catch (error) {
      return dto;
    }
  }

  /**
   * Create the initial database and run the migrations
   * @returns Success flag
   */
  async createDatabase(): Promise<void> {
    this.logger.verbose(`📂 Creating database`);
    try {
      // Run migrations
      await execa('prisma', ['migrate', 'deploy']);
      this.logger.debug('✅️ Database created');
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
