import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { MapService } from './map.service';

@ApiBearerAuth()
@ApiTags('map')
@Controller()
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('map/:id')
  @ApiOperation({ summary: 'Get specific map' })
  async getMapById(@Param('id') id: string) {
    return this.mapService.map({ id });
  }

  @Get('maps')
  @ApiOperation({ summary: 'Get all maps by user' })
  async getMaps() {
    return this.mapService.maps({});
  }

  @Delete('map/:id')
  @ApiOperation({ summary: 'Delete map' })
  async deleteMap(@Param('id') id: string) {
    return this.mapService.deleteMap({ id });
  }
}
