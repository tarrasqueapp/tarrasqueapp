import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import fs from 'fs-extra';

@Injectable()
export class TmpService {
  private logger: Logger = new Logger(TmpService.name);

  /**
   * Get file from temp path
   * @param fileName The name of the file
   * @returns The file body
   */
  async getFile(fileName: string): Promise<Buffer> {
    this.logger.verbose(`📂 Getting file "${fileName}" from temp path`);
    const path = `/tmp/${fileName}`;

    if (!(await fs.stat(path))) {
      throw new NotFoundException(`File "${fileName}" not found`);
    }

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
    const path = `/tmp/${fileName}`;

    if (!(await fs.stat(path))) {
      throw new NotFoundException(`File "${fileName}" not found`);
    }

    await fs.remove(path);
    this.logger.debug(`✅️ Deleted file "${fileName}" from temp path`);
  }
}
