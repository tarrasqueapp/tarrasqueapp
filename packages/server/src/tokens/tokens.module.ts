import { Module } from '@nestjs/common';

import { CampaignsService } from '../campaigns/campaigns.service';
import { MapsService } from '../maps/maps.service';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';

@Module({
  controllers: [TokensController],
  providers: [CampaignsService, MapsService, TokensService],
})
export class TokensModule {}
