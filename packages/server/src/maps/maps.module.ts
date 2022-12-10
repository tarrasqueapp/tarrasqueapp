import { Module } from '@nestjs/common';

import { CampaignsService } from '../campaigns/campaigns.service';
import { MediaService } from '../media/media.service';
import { StorageService } from '../storage/storage.service';
import { MapsController } from './maps.controller';
import { MapsGateway } from './maps.gateway';
import { MapsService } from './maps.service';

@Module({
  controllers: [MapsController],
  providers: [CampaignsService, MediaService, StorageService, MapsService, MapsGateway],
})
export class MapsModule {}
