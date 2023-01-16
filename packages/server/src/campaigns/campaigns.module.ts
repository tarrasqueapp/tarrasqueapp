import { Module, forwardRef } from '@nestjs/common';

import { EmailModule } from '../email/email.module';
import { GenericTokensModule } from '../generic-tokens/generic-tokens.module';
import { MapsModule } from '../maps/maps.module';
import { MediaModule } from '../media/media.module';
import { StorageModule } from '../storage/storage.module';
import { UsersModule } from '../users/users.module';
import { CampaignInvitesController } from './campaign-invites.controller';
import { CampaignInvitesService } from './campaign-invites.service';
import { CampaignMembersController } from './campaign-members.controller';
import { CampaignMembersService } from './campaign-members.service';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';

@Module({
  imports: [forwardRef(() => MapsModule), MediaModule, StorageModule, GenericTokensModule, UsersModule, EmailModule],
  controllers: [CampaignsController, CampaignInvitesController, CampaignMembersController],
  providers: [CampaignsService, CampaignInvitesService, CampaignMembersService],
  exports: [CampaignsService, CampaignInvitesService, CampaignMembersService],
})
export class CampaignsModule {}
