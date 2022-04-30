import { Module } from '@nestjs/common';

import { CampaignsModule } from './campaigns/campaigns.module';
import { MapsModule } from './maps/maps.module';
import { PointerModule } from './pointer/pointer.module';
import { SeedModule } from './seed/seed.module';
import { TokensModule } from './tokens/tokens.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [SeedModule, CampaignsModule, MapsModule, TokensModule, PointerModule, UsersModule],
})
export class AppModule {}
