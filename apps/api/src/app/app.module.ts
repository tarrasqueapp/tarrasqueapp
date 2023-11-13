import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'nestjs-prisma';

import { ActionTokensModule } from '../action-tokens/action-tokens.module';
import { AuthModule } from '../auth/auth.module';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { CharactersModule } from '../characters/characters.module';
import { MapsModule } from '../maps/maps.module';
import { MediaModule } from '../media/media.module';
import { PointerModule } from '../pointer/pointer.module';
import { SetupModule } from '../setup/setup.module';
import { TokensModule } from '../tokens/tokens.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    PrismaModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ActionTokensModule,
    AuthModule,
    CampaignsModule,
    CharactersModule,
    MapsModule,
    MediaModule,
    PointerModule,
    SetupModule,
    TokensModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
