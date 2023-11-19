import { Module, forwardRef } from '@nestjs/common';

import { ActionTokensModule } from '../../../action-tokens/action-tokens.module';
import { EmailModule } from '../../../email/email.module';
import { MapsModule } from '../../../maps/maps.module';
import { NotificationsModule } from '../../../notifications/notifications.module';
import { UsersModule } from '../../../users/users.module';
import { CampaignsModule } from '../../campaigns.module';
import { MembershipsModule } from '../memberships/memberships.module';
import { InvitesController } from './invites.controller';
import { InvitesGateway } from './invites.gateway';
import { InvitesService } from './invites.service';

@Module({
  imports: [
    EmailModule,
    ActionTokensModule,
    UsersModule,
    forwardRef(() => CampaignsModule),
    MembershipsModule,
    MapsModule,
    NotificationsModule,
  ],
  controllers: [InvitesController],
  providers: [InvitesService, InvitesGateway],
  exports: [InvitesService, InvitesGateway],
})
export class InvitesModule {}
