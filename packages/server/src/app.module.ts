import { Module } from '@nestjs/common';
import { APP_FILTER, RouterModule } from '@nestjs/core';
import { PrismaClientExceptionFilter, PrismaModule } from 'nestjs-prisma';

import { CampaignsModule } from './campaigns/campaigns.module';
import { CharactersModule } from './characters/entities/characters.module';
import { MapsModule } from './maps/maps.module';
import { PointerModule } from './pointer/pointer.module';
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
    CampaignsModule,
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
    CharactersModule,
    MapsModule,
    PointerModule,
    TokensModule,
    UsersModule,
  ],
})
export class AppModule {}
