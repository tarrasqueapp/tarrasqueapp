import { Module } from '@nestjs/common';

import { ActionTokensController } from './action-tokens.controller';
import { ActionTokensService } from './action-tokens.service';

@Module({
  imports: [],
  controllers: [ActionTokensController],
  providers: [ActionTokensService],
  exports: [ActionTokensService],
})
export class ActionTokensModule {}
