import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { EventTokensService } from './event-tokens.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [EventTokensService],
  exports: [EventTokensService],
})
export class EventTokensModule {}
