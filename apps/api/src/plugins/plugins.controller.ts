import { HttpService } from '@nestjs/axios';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';

import { RepositoryPluginEntity } from './entities/repository-plugin.entity';

@ApiTags('plugins')
@Controller('plugins')
export class PluginsController {
  constructor(private httpService: HttpService) {}

  /**
   * Get all available plugins from the repository
   * @returns All available plugins
   */
  @Get()
  @ApiOkResponse({ type: [RepositoryPluginEntity] })
  async getPlugins(): Promise<RepositoryPluginEntity[]> {
    const { data } = await lastValueFrom(
      this.httpService.get<RepositoryPluginEntity[]>(
        'https://raw.githubusercontent.com/tarrasqueapp/plugins/main/plugins.json',
      ),
    );

    return data;
  }
}
