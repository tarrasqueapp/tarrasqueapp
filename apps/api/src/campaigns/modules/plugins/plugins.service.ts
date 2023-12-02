import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { InstallPluginDto } from './dto/install-plugin.dto';
import { PluginEntity } from './entities/plugin.entity';
import { PluginsGateway } from './plugins.gateway';

@Injectable()
export class PluginsService {
  private logger: Logger = new Logger(PluginsService.name);

  constructor(
    private prisma: PrismaService,
    private pluginsGateway: PluginsGateway,
  ) {}

  /**
   * Get a campaign's plugins
   * @param campaignId - The campaign's id
   * @returns Campaign plugins
   */
  async getPluginsByCampaignId(campaignId: string): Promise<PluginEntity[]> {
    this.logger.verbose(`📂 Getting campaign "${campaignId}" plugins`);
    try {
      // Get the plugins
      const plugins = await this.prisma.plugin.findMany({
        where: { campaignId },
        orderBy: { createdAt: 'asc' },
      });
      this.logger.debug(`✅️ Found campaign "${campaignId}" plugins`);
      return plugins;
    } catch (error) {
      this.logger.error(`🚨 Failed to get campaign "${campaignId}" plugins`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Get a campaign's plugin by id
   * @param id - The plugin's id
   * @returns The plugin
   */
  async getPluginById(id: string): Promise<PluginEntity> {
    this.logger.verbose(`📂 Getting plugin "${id}"`);
    try {
      // Get the plugin
      const plugin = await this.prisma.plugin.findFirst({
        where: { id },
      });

      if (!plugin) {
        this.logger.error(`🚨 Failed to get plugin "${id}"`);
        return null;
      }

      // Return the plugin
      this.logger.debug(`✅️ Found plugin "${id}"`);
      return plugin;
    } catch (error) {
      this.logger.error(`🚨 Failed to get plugin "${id}"`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Create a campaign plugin
   * @param plugin - The plugin to create
   * @returns The created plugin
   */
  async installPlugin(plugin: InstallPluginDto): Promise<PluginEntity> {
    // Create the plugin
    const createdPlugin = await this.prisma.plugin.create({
      data: {
        manifestUrl: plugin.manifestUrl,
        campaignId: plugin.campaignId,
      },
    });

    // Emit the new plugin to the campaign's room
    this.pluginsGateway.installPlugin(createdPlugin);

    // Return the created plugin
    return createdPlugin;
  }

  /**
   * Delete a campaign plugin
   * @param plugin - The plugin to delete
   * @returns The deleted plugin
   */
  async uninstallPlugin(plugin: PluginEntity): Promise<PluginEntity> {
    // Delete the plugin
    const deletedPlugin = await this.prisma.plugin.delete({
      where: { id: plugin.id },
    });

    // Emit the deleted plugin to the campaign's room and the user's room
    this.pluginsGateway.uninstallPlugin(deletedPlugin);

    // Return the deleted plugin
    return deletedPlugin;
  }
}
