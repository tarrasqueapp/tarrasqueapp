import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import * as fg from 'fast-glob';
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

    // Get all files that match the file name
    const paths = await fg([`${TEMP_PATH}/${fileName}*`]);

    // Delete the file
    for (const path of paths) {
      fs.remove(path);
    }
    this.logger.debug(`✅️ Deleted file "${fileName}" from temp path`);
  }
}
