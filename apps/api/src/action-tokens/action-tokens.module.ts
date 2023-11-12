import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ActionTokensService } from './action-tokens.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [ActionTokensService],
  exports: [ActionTokensService],
})
export class ActionTokensModule {}
