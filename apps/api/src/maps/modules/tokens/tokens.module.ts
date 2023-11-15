import { Module } from '@nestjs/common';

import { CampaignsModule } from '../../../campaigns/campaigns.module';
import { MapsModule } from '../../maps.module';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';

@Module({
  imports: [CampaignsModule, MapsModule],
  controllers: [TokensController],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
