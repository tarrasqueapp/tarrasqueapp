import { Controller, Delete, Get, Param } from '@nestjs/common';

import { MapService } from './map.service';

@Controller()
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('map/:id')
  async getMapById(@Param('id') id: string) {
    return this.mapService.map({ id });
  }

  @Get('maps')
  async getMaps() {
    return this.mapService.maps({});
  }

  @Delete('map/:id')
  async deleteMap(@Param('id') id: string) {
    return this.mapService.deleteMap({ id });
  }
}
