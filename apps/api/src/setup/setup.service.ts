import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Setup } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { run } from '../helpers';
import { SetupStep } from './setup-step.enum';

@Injectable()
export class SetupService {
  private logger: Logger = new Logger(SetupService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get the setup
   * @returns The setup
   */
  async getSetup(): Promise<Setup> {
    this.logger.verbose(`📂 Getting setup`);
    try {
      // Get the setup
      const setup = await this.prisma.setup.findUniqueOrThrow({ where: { id: 1 } });
      this.logger.debug(`✅️ Fetched setup`);
      return setup;
    } catch (error) {
      return { id: 1, step: SetupStep.DATABASE, completed: false };
    }
  }

  /**
   * Create the setup table
   * @returns The created setup
   */
  async createSetup(): Promise<Setup> {
    this.logger.verbose(`📂 Creating setup`);
    try {
      // Create the setup
      const setup = await this.prisma.setup.create({ data: { id: 1, step: SetupStep.USER, completed: false } });
      this.logger.debug(`✅️ Created setup`);
      return setup;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Update the setup
   * @param data - The setup to update with
   * @returns The updated setup
   */
  async updateSetup(data: Partial<Setup>): Promise<Setup> {
    this.logger.verbose(`📂 Updating setup`);
    try {
      // Update the setup
      const setup = await this.prisma.setup.update({ where: { id: 1 }, data });
      this.logger.debug(`✅️ Updated setup`);
      return setup;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Create the initial database and run the migrations
   */
  async createDatabase(): Promise<void> {
    this.logger.verbose(`📂 Creating database`);
    try {
      // Run migrations and log the output
      const result = await run('prisma migrate deploy');
      this.logger.debug(result);
      this.logger.debug('✅️ Database created');
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
