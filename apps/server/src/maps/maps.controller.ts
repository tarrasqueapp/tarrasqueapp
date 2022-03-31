import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { MapsService } from './maps.service';

@ApiTags('maps')
@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get('')
  @ApiBearerAuth('test')
  @ApiOperation({ summary: 'Get all maps by user' })
  async getMaps() {
    return this.mapsService.maps({});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific map' })
  async getMapById(@Param('id') id: string) {
    return this.mapsService.map({ id });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete map' })
  async deleteMap(@Param('id') id: string) {
    return this.mapsService.deleteMap({ id });
  }
}
