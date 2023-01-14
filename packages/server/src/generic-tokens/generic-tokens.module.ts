import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { CampaignInviteTokensService } from './campaign-invite-tokens.service';
import { EmailVerificationTokensService } from './email-verification-tokens.service';
import { GenericTokensService } from './generic-tokens.service';
import { PasswordResetTokensService } from './password-reset-tokens.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    GenericTokensService,
    EmailVerificationTokensService,
    PasswordResetTokensService,
    CampaignInviteTokensService,
  ],
  exports: [
    GenericTokensService,
    EmailVerificationTokensService,
    PasswordResetTokensService,
    CampaignInviteTokensService,
  ],
})
export class GenericTokensModule {}
