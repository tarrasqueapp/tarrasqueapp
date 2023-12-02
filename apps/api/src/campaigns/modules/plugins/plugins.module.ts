import { Module, forwardRef } from '@nestjs/common';

import { MapsModule } from '../../../maps/maps.module';
import { CampaignsModule } from '../../campaigns.module';
import { PluginsController } from './plugins.controller';
import { PluginsGateway } from './plugins.gateway';
import { PluginsService } from './plugins.service';

@Module({
  imports: [MapsModule, forwardRef(() => CampaignsModule)],
  controllers: [PluginsController],
  providers: [PluginsService, PluginsGateway],
  exports: [PluginsService, PluginsGateway],
})
export class PluginsModule {}
