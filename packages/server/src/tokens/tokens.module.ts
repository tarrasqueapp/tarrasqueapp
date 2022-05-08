import { Module } from '@nestjs/common';

import { CampaignsService } from '../campaigns/campaigns.service';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';

@Module({
  controllers: [TokensController],
  providers: [CampaignsService, TokensService],
})
export class TokensModule {}
