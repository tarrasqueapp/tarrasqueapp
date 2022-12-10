import { Module } from '@nestjs/common';

import { MapsService } from '../maps/maps.service';
import { MediaService } from '../media/media.service';
import { StorageService } from '../storage/storage.service';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService, MapsService, MediaService, StorageService],
})
export class CampaignsModule {}
