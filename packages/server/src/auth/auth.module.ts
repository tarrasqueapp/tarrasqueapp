import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { EmailService } from '../email/email.service';
import { GenericTokensService } from '../generic-tokens/generic-tokens.service';
import { ResetPasswordTokensService } from '../generic-tokens/reset-password-tokens.service';
import { VerifyEmailTokensService } from '../generic-tokens/verify-email-tokens.service';
import { MediaService } from '../media/media.service';
import { StorageService } from '../storage/storage.service';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    UsersService,
    MediaService,
    StorageService,
    VerifyEmailTokensService,
    ResetPasswordTokensService,
    GenericTokensService,
    EmailService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
