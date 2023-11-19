import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { ActionTokensModule } from '../action-tokens/action-tokens.module';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { InvitesModule } from '../campaigns/modules/invites/invites.module';
import { MembershipsModule } from '../campaigns/modules/memberships/memberships.module';
import { EmailModule } from '../email/email.module';
import { MapsModule } from '../maps/maps.module';
import { MediaModule } from '../media/media.module';
import { StorageModule } from '../storage/storage.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtWsStrategy } from './strategies/jwt-ws.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    MediaModule,
    StorageModule,
    ActionTokensModule,
    EmailModule,
    CampaignsModule,
    MapsModule,
    MembershipsModule,
    InvitesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtWsStrategy],
  exports: [AuthService],
})
export class AuthModule {}
