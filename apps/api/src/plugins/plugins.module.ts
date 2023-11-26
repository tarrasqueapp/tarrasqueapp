import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { PluginsController } from './plugins.controller';

@Module({
  imports: [HttpModule],
  controllers: [PluginsController],
  providers: [],
  exports: [],
})
export class PluginsModule {}
