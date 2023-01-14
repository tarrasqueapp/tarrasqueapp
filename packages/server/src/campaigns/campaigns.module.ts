import { Module, forwardRef } from '@nestjs/common';

import { GenericTokensModule } from '../generic-tokens/generic-tokens.module';
import { MapsModule } from '../maps/maps.module';
import { MediaModule } from '../media/media.module';
import { StorageModule } from '../storage/storage.module';
import { UsersModule } from '../users/users.module';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';

@Module({
  imports: [forwardRef(() => MapsModule), MediaModule, StorageModule, GenericTokensModule, UsersModule],
  controllers: [CampaignsController],
  providers: [CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule {}
