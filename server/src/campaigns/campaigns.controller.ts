import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CampaignsService } from './campaigns.service';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get('')
  @ApiBearerAuth('test')
  @ApiOperation({ summary: 'Get all campaigns by user' })
  async getCampaigns() {
    return this.campaignsService.campaigns({});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific map' })
  async getCampaignById(@Param('id') id: string) {
    return this.campaignsService.campaign({ id });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete map' })
  async deleteCampaign(@Param('id') id: string) {
    return this.campaignsService.deleteCampaign({ id });
  }
}
