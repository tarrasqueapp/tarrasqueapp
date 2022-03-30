import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { MapController } from './map.controller';
import { MapGateway } from './map.gateway';
import { MapService } from './map.service';

@Module({
  controllers: [MapController],
  providers: [MapService, MapGateway, PrismaService],
})
export class MapModule {}
