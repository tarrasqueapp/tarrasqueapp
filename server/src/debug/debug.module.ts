import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { DebugController } from './debug.controller';
import { DebugService } from './debug.service';

@Module({
  controllers: [DebugController],
  providers: [DebugService, PrismaService],
})
export class DebugModule {}
