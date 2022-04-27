import { Controller, Get } from '@nestjs/common';

import { DebugService } from './debug.service';

@Controller('debug')
export class DebugController {
  constructor(private readonly debugService: DebugService) {}

  @Get('')
  async debug() {
    await this.debugService.deleteAllData();
    await this.debugService.createNewData();
    return { success: true };
  }
}
