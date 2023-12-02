import { HttpService } from '@nestjs/axios';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';

import { SubmittedPluginEntity } from './entities/submitted-plugin.entity';

@ApiTags('plugins')
@Controller('plugins')
export class PluginsController {
  constructor(private httpService: HttpService) {}

  /**
   * Get all submitted plugins from the repository
   * @returns All submitted plugins
   */
  @Get()
  @ApiOkResponse({ type: [SubmittedPluginEntity] })
  async getPlugins(): Promise<SubmittedPluginEntity[]> {
    const { data } = await lastValueFrom(
      this.httpService.get<SubmittedPluginEntity[]>(
        'https://raw.githubusercontent.com/tarrasqueapp/plugins/main/plugins.json',
      ),
    );

    return data;
  }
}
