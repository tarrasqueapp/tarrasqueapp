import { Module } from '@nestjs/common';

import { CampaignsModule } from './campaigns/campaigns.module';
import { DebugModule } from './debug/debug.module';
import { MapsModule } from './maps/maps.module';
import { PointerModule } from './pointer/pointer.module';
import { TokensModule } from './tokens/tokens.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [DebugModule, CampaignsModule, MapsModule, TokensModule, PointerModule, UserModule],
})
export class AppModule {}
