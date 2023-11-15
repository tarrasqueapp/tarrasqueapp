import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { SetupDto } from './dto/setup.dto';
import { SetupGuard } from './guards/setup.guard';
import { SetupService } from './setup.service';

@ApiTags('setup')
@Controller('setup')
export class SetupController {
  constructor(private setupService: SetupService) {}

  /**
   * Get the setup progress
   */
  @Get()
  @ApiOkResponse({ type: SetupDto })
  getSetup(): Promise<SetupDto> {
    return this.setupService.getSetup();
  }

  /**
   * Update the setup progress
   * @param data - The setup progress
   * @returns The updated setup progress
   */
  @UseGuards(SetupGuard)
  @Put()
  @ApiOkResponse({ type: SetupDto })
  updateSetup(@Body() data: Partial<SetupDto>): Promise<SetupDto> {
    return this.setupService.updateSetup(data);
  }

  /**
   * Create the database
   */
  @UseGuards(SetupGuard)
  @Post('create-database')
  @ApiOkResponse({ type: null })
  async createDatabase(): Promise<void> {
    await this.setupService.createDatabase();
    await this.setupService.createSetup();
  }
}
