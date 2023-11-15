import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'nestjs-prisma';

import { config } from '@tarrasque/common';

import { VersionEntity } from './entities/VersionEntity';

@ApiTags()
@Controller()
export class AppController {
  constructor(private prismaService: PrismaService) {}

  /**
   * Get version of currently running server
   * @returns Server version
   */
  @Get('version')
  @ApiOkResponse({ type: VersionEntity })
  getVersion(): VersionEntity {
    const entity = new VersionEntity();
    entity.version = `v${config.VERSION}`;
    return entity;
  }

  /**
   * Health check endpoint
   * @returns OK
   */
  @Get('health')
  async healthCheck(): Promise<string> {
    // Check the PostgreSQL connection
    const postgres = await this.prismaService.$executeRaw<number>`SELECT 1`;
    if (postgres !== 1) {
      throw new InternalServerErrorException('Database connection failed');
    }

    return 'OK';
  }
}
