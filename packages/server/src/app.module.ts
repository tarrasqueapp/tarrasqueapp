import { Module } from '@nestjs/common';
import { APP_FILTER, RouterModule } from '@nestjs/core';
import { PrismaClientExceptionFilter, PrismaModule } from 'nestjs-prisma';

import { AuthModule } from './auth/auth.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { CharactersModule } from './characters/entities/characters.module';
import { MapsModule } from './maps/maps.module';
import { PointerModule } from './pointer/pointer.module';
import { SetupModule } from './setup/setup.module';
import { TokensModule } from './tokens/tokens.module';
import { UsersModule } from './users/users.module';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
  ],
  imports: [
    PrismaModule.forRoot({ isGlobal: true }),
    RouterModule.register([
      {
        path: '/campaigns',
        module: CampaignsModule,
        children: [
          {
            path: '/:campaignId/characters',
            module: CharactersModule,
          },
          {
            path: '/:campaignId/maps',
            module: MapsModule,
            children: [
              {
                path: '/:mapId/pointer',
                module: PointerModule,
              },
              {
                path: '/:mapId/tokens',
                module: TokensModule,
              },
            ],
          },
        ],
      },
    ]),
    AuthModule,
    CampaignsModule,
    CharactersModule,
    MapsModule,
    PointerModule,
    SetupModule,
    TokensModule,
    UsersModule,
  ],
})
export class AppModule {}
