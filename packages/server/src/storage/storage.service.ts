import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable, InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs-extra';

import { config } from '../config';
import { StorageProviderEnum } from './storage-provider.enum';

@Injectable()
export class StorageService implements OnModuleInit {
  private logger: Logger = new Logger(StorageService.name);
  private s3: S3;

  /**
   * Validate storage provider and configure S3 client
   */
  onModuleInit() {
    switch (config.STORAGE_PROVIDER) {
      case StorageProviderEnum.LOCAL:
        break;

      case StorageProviderEnum.S3:
        // Create S3 client
        this.logger.verbose(`📂 Setting up S3 client`);
        this.s3 = new S3({
          endpoint: config.STORAGE_S3_ENDPOINT,
          region: config.STORAGE_S3_REGION,
          credentials: {
            accessKeyId: config.STORAGE_S3_ACCESS_KEY_ID,
            secretAccessKey: config.STORAGE_S3_SECRET_ACCESS_KEY,
          },
        });
        break;

      default:
        throw new Error(`Storage provider ${config.STORAGE_PROVIDER} is not supported`);
    }
  }

  /**
   * Upload a file to storage
   * @param key The key of the file
   * @param body The body of the file
   * @returns The created file URL
   */
  upload(key: string, body: Buffer): Promise<string> {
    switch (config.STORAGE_PROVIDER) {
      case StorageProviderEnum.LOCAL:
        return this.uploadLocal(key, body);

      case StorageProviderEnum.S3:
        return this.uploadS3(key, body);

      default:
        throw new Error(`Storage provider ${config.STORAGE_PROVIDER} is not supported`);
    }
  }

  /**
   * Upload a file to local storage
   * @param key The key of the file
   * @param body The body of the file
   * @returns The created file URL
   */
  async uploadLocal(key: string, body: Buffer): Promise<string> {
    this.logger.verbose(`📂 Uploading file "${key} to local storage`);
    try {
      // Get proceeding directories
      const directories = key.split('/').slice(0, -1).join('/');

      // Ensure upload directory exists
      await fs.ensureDir(`/uploads/${directories}`);

      // Write file to disk
      const filePath = `/uploads/${key}`;
      await fs.writeFile(filePath, body);

      // Return public file URL
      this.logger.debug(`✅️ Uploaded file "${key}" to local storage`);
      return `${config.DOMAIN_FULL}${filePath}`;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Upload a file to S3
   * @param key The key of the file
   * @param body The body of the file
   * @returns The created file URL
   */
  async uploadS3(key: string, body: Buffer): Promise<string> {
    this.logger.verbose(`📂 Uploading file "${key} to S3`);
    try {
      // Upload file to S3
      const upload = new Upload({
        client: this.s3,
        params: { Bucket: config.STORAGE_S3_BUCKET, Key: `uploads/${key}`, Body: body },
      });

      // Listen for upload progress
      upload.on('httpUploadProgress', (progress) => {
        this.logger.verbose(`📂 Uploading file "${key}" to S3: ${progress.loaded}/${progress.total}`);
      });

      // Wait for upload to finish
      await upload.done();

      // Return public file URL
      this.logger.debug(`✅️ Uploaded file "${key}" to S3`);
      return `${config.STORAGE_S3_URL}/uploads/${key}`;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
