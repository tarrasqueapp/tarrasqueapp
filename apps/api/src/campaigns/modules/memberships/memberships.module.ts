import { Module, forwardRef } from '@nestjs/common';

import { MapsModule } from '../../../maps/maps.module';
import { CampaignsModule } from '../../campaigns.module';
import { MembershipsController } from './memberships.controller';
import { MembershipsGateway } from './memberships.gateway';
import { MembershipsService } from './memberships.service';

@Module({
  imports: [forwardRef(() => CampaignsModule), MapsModule],
  controllers: [MembershipsController],
  providers: [MembershipsService, MembershipsGateway],
  exports: [MembershipsService, MembershipsGateway],
})
export class MembershipsModule {}
