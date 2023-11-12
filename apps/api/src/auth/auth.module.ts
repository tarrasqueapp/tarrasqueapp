import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ActionTokensModule } from '../action-tokens/action-tokens.module';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { EmailModule } from '../email/email.module';
import { MediaModule } from '../media/media.module';
import { StorageModule } from '../storage/storage.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserNotificationsController } from './user-notifications.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    UsersModule,
    MediaModule,
    StorageModule,
    ActionTokensModule,
    EmailModule,
    CampaignsModule,
  ],
  controllers: [AuthController, UserNotificationsController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
