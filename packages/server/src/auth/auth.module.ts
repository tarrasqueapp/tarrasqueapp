import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { EmailService } from '../email/email.service';
import { EmailVerificationTokensService } from '../generic-tokens/email-verification-tokens.service';
import { GenericTokensService } from '../generic-tokens/generic-tokens.service';
import { PasswordResetTokensService } from '../generic-tokens/password-reset-tokens.service';
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
    EmailVerificationTokensService,
    PasswordResetTokensService,
    GenericTokensService,
    EmailService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
