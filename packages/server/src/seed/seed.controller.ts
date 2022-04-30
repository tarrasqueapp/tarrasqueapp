import { Controller, Get } from '@nestjs/common';

import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('')
  async seed() {
    await this.seedService.deleteAllData();
    await this.seedService.createNewData();
    return { success: true };
  }
}
