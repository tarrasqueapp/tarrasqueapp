import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { CampaignsService } from '../../campaigns.service';
import { ConnectCampaignDto } from '../../dto/connect-campaign.dto';
import { RoleGuard } from '../../guards/role.guard';
import { ConnectCampaignPluginDto } from './dto/connect-campaign-plugin.dto';
import { InstallPluginDto } from './dto/install-plugin.dto';
import { PluginEntity } from './entities/plugin.entity';
import { PluginsService } from './plugins.service';

@UseGuards(JwtAuthGuard)
@Controller('campaigns/:campaignId/plugins')
export class PluginsController {
  constructor(
    private pluginsService: PluginsService,
    private campaignsService: CampaignsService,
  ) {}

  /**
   * Get a campaign's plugins
   * @param params - The campaign's id
   * @returns The campaign's plugins
   */
  @Get()
  async getCampaignPlugins(@Param() params: ConnectCampaignDto): Promise<PluginEntity[] | undefined> {
    // Get the campaign with its plugins
    return await this.pluginsService.getPluginsByCampaignId(params.campaignId);
  }

  /**
   * Add a plugin to a campaign
   * @param params - The campaign's id
   * @param data - The user's data
   */
  @UseGuards(RoleGuard(Role.GAME_MASTER))
  @Post()
  async installPlugin(@Param() params: ConnectCampaignDto, @Body() data: InstallPluginDto): Promise<PluginEntity> {
    // Check that the campaign exists
    const campaign = await this.campaignsService.getCampaignById(params.campaignId);
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Get the campaign's plugins
    const plugins = await this.pluginsService.getPluginsByCampaignId(params.campaignId);

    // Check that the plugin is not already installed
    plugins.forEach((plugin) => {
      if (plugin.manifestUrl === data.manifestUrl) {
        throw new ConflictException('Plugin already installed');
      }
    });

    // Install the plugin
    const plugin = await this.pluginsService.installPlugin({
      manifestUrl: data.manifestUrl,
      campaignId: params.campaignId,
    });

    // Return the plugin
    return plugin;
  }

  /**
   * Delete a campaign plugin
   * @param params - The campaign's id and plugin's id
   * @returns The deleted plugin
   */
  @UseGuards(RoleGuard(Role.GAME_MASTER))
  @Delete(':pluginId')
  async uninstallPlugin(@Param() params: ConnectCampaignPluginDto): Promise<PluginEntity> {
    // Check that the campaign exists
    const campaign = await this.campaignsService.getCampaignById(params.campaignId);
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Check that plugin exists
    const plugin = await this.pluginsService.getPluginById(params.pluginId);
    if (!plugin) {
      throw new NotFoundException('Plugin not installed in campaign');
    }

    const uninstalledPlugin = await this.pluginsService.uninstallPlugin(plugin);

    // Return the deleted plugin
    return uninstalledPlugin;
  }
}
