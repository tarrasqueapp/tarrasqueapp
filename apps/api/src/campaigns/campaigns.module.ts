import { Module, forwardRef } from '@nestjs/common';

import { MapsModule } from '../maps/maps.module';
import { MediaModule } from '../media/media.module';
import { StorageModule } from '../storage/storage.module';
import { UsersModule } from '../users/users.module';
import { CampaignsController } from './campaigns.controller';
import { CampaignsGateway } from './campaigns.gateway';
import { CampaignsService } from './campaigns.service';
import { InvitesModule } from './modules/invites/invites.module';
import { MembershipsModule } from './modules/memberships/memberships.module';
import { PluginsModule } from './modules/plugins/plugins.module';

@Module({
  imports: [
    forwardRef(() => MapsModule),
    MediaModule,
    StorageModule,
    UsersModule,
    forwardRef(() => MembershipsModule),
    forwardRef(() => InvitesModule),
    forwardRef(() => PluginsModule),
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService, CampaignsGateway],
  exports: [CampaignsService, CampaignsGateway],
})
export class CampaignsModule {}
