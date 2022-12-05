import { DeleteObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable, InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs-extra';

import { config } from '../config';
import { StorageProviderEnum } from './storage-provider.enum';

const UPLOAD_PATH = '/uploads';

@Injectable()
export class StorageService implements OnModuleInit {
  private logger: Logger = new Logger(StorageService.name);
  private s3: S3;

  /**
   * Validate storage provider, ensure upload path exists, and configure S3 client
   */
  async onModuleInit() {
    switch (config.STORAGE_PROVIDER) {
      case StorageProviderEnum.LOCAL:
        await fs.ensureDir(UPLOAD_PATH);
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
   * @param contentType The content type of the file
   * @returns The created file URL
   */
  upload(key: string, body: Buffer, contentType: string): Promise<string> {
    switch (config.STORAGE_PROVIDER) {
      case StorageProviderEnum.LOCAL:
        return this.uploadLocal(key, body);

      case StorageProviderEnum.S3:
        return this.uploadS3(key, body, contentType);

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
      await fs.ensureDir(`${UPLOAD_PATH}/${directories}`);

      // Write file to disk
      const filePath = `${UPLOAD_PATH}/${key}`;
      await fs.writeFile(filePath, body);

      // Return public file URL
      this.logger.debug(`✅️ Uploaded file "${key}" to local storage`);
      return `${config.HOST}${filePath}`;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Upload a file to S3
   * @param key The key of the file
   * @param body The body of the file
   * @param contentType The content type of the file
   * @returns The created file URL
   */
  async uploadS3(key: string, body: Buffer, contentType: string): Promise<string> {
    this.logger.verbose(`📂 Uploading file "${key} to S3`);
    try {
      // Upload file to S3
      const upload = new Upload({
        client: this.s3,
        params: {
          Bucket: config.STORAGE_S3_BUCKET,
          Key: `uploads/${key}`,
          Body: body,
          ContentType: contentType,
          ACL: 'public-read',
        },
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

  /**
   * Delete a file from storage
   * @param key The key of the file
   */
  delete(key: string): Promise<void> {
    switch (config.STORAGE_PROVIDER) {
      case StorageProviderEnum.LOCAL:
        return this.deleteLocal(key);

      case StorageProviderEnum.S3:
        return this.deleteS3(key);

      default:
        throw new Error(`Storage provider ${config.STORAGE_PROVIDER} is not supported`);
    }
  }

  /**
   * Delete a file from local storage
   * @param key The key of the file
   */
  async deleteLocal(key: string): Promise<void> {
    this.logger.verbose(`📂 Deleting file "${key} from local storage`);
    try {
      // Get proceeding directories
      const directories = key.split('/').slice(0, -1).join('/');

      // Ensure upload directory exists
      await fs.ensureDir(`${UPLOAD_PATH}/${directories}`);

      // Remove file from disk
      const filePath = `${UPLOAD_PATH}/${key}`;
      await fs.remove(filePath);

      this.logger.debug(`✅️ Deleted file "${key}" from local storage`);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Delete a file from S3
   * @param key The key of the file
   */
  async deleteS3(key: string): Promise<void> {
    this.logger.verbose(`📂 Deleting file "${key} from S3`);
    try {
      // Remove file from S3
      await this.s3.send(new DeleteObjectCommand({ Bucket: config.STORAGE_S3_BUCKET, Key: `uploads/${key}` }));

      this.logger.debug(`✅️ Deleted file "${key}" from S3`);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
