import { Module } from '@nestjs/common';

import { SetupController } from './setup.controller';
import { SetupService } from './setup.service';

@Module({
  imports: [],
  controllers: [SetupController],
  providers: [SetupService],
  exports: [SetupService],
})
export class SetupModule {}
