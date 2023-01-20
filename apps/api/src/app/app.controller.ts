import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { config } from '../config';
import { VersionEntity } from './entities/VersionEntity';

@ApiTags()
@Controller()
export class AppController {
  /**
   * Get version
   */
  @Get('version')
  @ApiOkResponse({ type: VersionEntity })
  getUsers(): VersionEntity {
    const entity = new VersionEntity();
    entity.version = `v${config.VERSION}`;
    return entity;
  }
}
