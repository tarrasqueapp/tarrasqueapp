import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as execa from 'execa';
import { CampaignsService } from 'src/campaigns/campaigns.service';
import { MapsService } from 'src/maps/maps.service';
import { UsersService } from 'src/users/users.service';

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
      const userCount = await this.usersService.getUserCount();
      dto.databaseCreated = true;
      dto.userCreated = userCount > 0;
      // Get campaign count
      const campaignCount = await this.campaignsService.getCampaignCount();
      dto.campaignCreated = campaignCount > 0;
      // Get map count
      const mapCount = await this.mapsService.getMapCount();
      dto.mapCreated = mapCount > 0;
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
