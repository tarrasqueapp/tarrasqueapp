import { Module, forwardRef } from '@nestjs/common';

import { CampaignsModule } from '../campaigns/campaigns.module';
import { MediaModule } from '../media/media.module';
import { StorageModule } from '../storage/storage.module';
import { MapsController } from './maps.controller';
import { MapsGateway } from './maps.gateway';
import { MapsService } from './maps.service';

@Module({
  imports: [forwardRef(() => CampaignsModule), MediaModule, StorageModule],
  controllers: [MapsController],
  providers: [MapsService, MapsGateway],
  exports: [MapsService],
})
export class MapsModule {}
