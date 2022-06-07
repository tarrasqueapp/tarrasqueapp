import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { CampaignRole, CampaignRoleGuard } from '../campaigns/guards/campaign-role.guard';
import { User } from '../users/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { RoleGuard } from '../users/guards/role.guard';
import { ConnectMapDto } from './dto/connect-map.dto';
import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import { MapBaseEntity } from './entities/map-base.entity';
import { MapEntity } from './entities/map.entity';
import { MapsService } from './maps.service';

@ApiTags('maps')
@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  /**
   * Get a map by its id
   */
  @Get(':mapId')
  @ApiOkResponse({ type: MapEntity })
  getMap(@Param() { mapId }: ConnectMapDto): Promise<MapEntity> {
    return this.mapsService.getMap(mapId);
  }

  /**
   * Create a new map
   */
  @Post()
  @UseGuards(CampaignRoleGuard(CampaignRole.OWNER))
  @UseGuards(RoleGuard(Role.USER))
  @ApiBearerAuth()
  @ApiOkResponse({ type: MapBaseEntity })
  createMap(@Body() data: CreateMapDto, @User() user: UserEntity): Promise<MapBaseEntity> {
    return this.mapsService.createMap(data, user.id);
  }

  /**
   * Duplicate a map
   */
  @Post(':mapId/duplicate')
  @UseGuards(CampaignRoleGuard(CampaignRole.OWNER))
  @UseGuards(RoleGuard(Role.USER))
  @ApiBearerAuth()
  @ApiOkResponse({ type: MapBaseEntity })
  duplicateMap(@Param() { mapId }: ConnectMapDto): Promise<MapBaseEntity> {
    return this.mapsService.duplicateMap(mapId);
  }

  /**
   * Update a map
   */
  @Put(':mapId')
  @UseGuards(CampaignRoleGuard(CampaignRole.OWNER))
  @UseGuards(RoleGuard(Role.USER))
  @ApiBearerAuth()
  @ApiOkResponse({ type: MapBaseEntity })
  updateMap(@Param() { mapId }: ConnectMapDto, @Body() data: UpdateMapDto): Promise<MapBaseEntity> {
    return this.mapsService.updateMap(mapId, data);
  }

  /**
   * Delete a map
   */
  @Delete(':mapId')
  @UseGuards(CampaignRoleGuard(CampaignRole.OWNER))
  @UseGuards(RoleGuard(Role.USER))
  @ApiBearerAuth()
  @ApiOkResponse({ type: MapBaseEntity })
  deleteMap(@Param() { mapId }: ConnectMapDto): Promise<MapBaseEntity> {
    return this.mapsService.deleteMap(mapId);
  }
}
