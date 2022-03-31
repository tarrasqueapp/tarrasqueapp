import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { MapsController } from './maps.controller';
import { MapsGateway } from './maps.gateway';
import { MapsService } from './maps.service';

@Module({
  controllers: [MapsController],
  providers: [MapsService, MapsGateway, PrismaService],
})
export class MapsModule {}
