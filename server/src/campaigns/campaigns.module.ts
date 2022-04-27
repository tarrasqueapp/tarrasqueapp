import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService, PrismaService],
})
export class CampaignsModule {}
