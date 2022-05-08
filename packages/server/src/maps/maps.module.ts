import { Module } from '@nestjs/common';

import { CampaignsService } from '../campaigns/campaigns.service';
import { MapsController } from './maps.controller';
import { MapsGateway } from './maps.gateway';
import { MapsService } from './maps.service';

@Module({
  controllers: [MapsController],
  providers: [CampaignsService, MapsService, MapsGateway],
})
export class MapsModule {}
