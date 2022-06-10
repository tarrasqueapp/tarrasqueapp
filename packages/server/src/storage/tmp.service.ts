import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs-extra';

export const TEMP_PATH = '/tmp/uploads';

@Injectable()
export class TmpService implements OnModuleInit {
  private logger: Logger = new Logger(TmpService.name);

  /**
   * Ensure the temp path exists
   */
  async onModuleInit() {
    await fs.ensureDir(TEMP_PATH);
  }

  /**
   * Remove old files from temp path every hour
   */
  @Cron(CronExpression.EVERY_HOUR)
  async removeOldFiles() {
    this.logger.verbose('📂 Checking for old files to remove from temp path');

    // Get all files in the temp path that are older than an hour
    const files = await fs.readdir(TEMP_PATH);
    // Set cutoff to be an hour ago
    const livesUntil = Date.now() - 3600000;
    let count = 0;

    for (const file of files) {
      const path = `${TEMP_PATH}/${file}`;
      const stats = await fs.stat(path);
      // Check if the file is older than the cutoff
      if (stats.mtimeMs < livesUntil) {
        this.logger.verbose(`📂 Removing old file ${path}`);
        await fs.remove(path);
        count++;
      }
    }

    this.logger.verbose(`📂 Removed ${count} old files from temp path`);
  }

  /**
   * Get file from temp path
   * @param fileName The name of the file
   * @returns The file body
   */
  async getFile(fileName: string): Promise<Buffer> {
    this.logger.verbose(`📂 Getting file "${fileName}" from temp path`);
    const path = `${TEMP_PATH}/${fileName}`;

    // Check that the file exists
    if (!(await fs.stat(path))) {
      throw new NotFoundException(`File "${fileName}" not found`);
    }

    // Get the file
    const file = await fs.readFile(path);
    this.logger.debug(`✅️ Retrieved file "${fileName}" from temp path`);

    return file;
  }

  /**
   * Delete file from temp path
   * @param fileName The name of the file
   */
  async deleteFile(fileName: string): Promise<void> {
    this.logger.verbose(`📂 Deleting file "${fileName}" from temp path`);
    const path = `${TEMP_PATH}/${fileName}`;

    // Check that the file exists
    if (!(await fs.stat(path))) {
      throw new NotFoundException(`File "${fileName}" not found`);
    }

    // Delete the file
    fs.remove(path);
    this.logger.debug(`✅️ Deleted file "${fileName}" from temp path`);
  }
}
