import { Module } from '@nestjs/common';

import { MapsService } from '../maps/maps.service';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService, MapsService],
})
export class CampaignsModule {}
