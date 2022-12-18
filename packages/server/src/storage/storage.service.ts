import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsCommand,
  S3,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable, InternalServerErrorException, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs-extra';
import { Readable } from 'stream';

import { config } from '../config';
import { StorageProviderEnum } from './storage-provider.enum';

@Injectable()
export class StorageService implements OnModuleInit {
  private logger: Logger = new Logger(StorageService.name);
  private s3: S3;
  public uploadPathLocal = '/uploads';
  public uploadPathS3 = 'uploads';
  public uploadPath: string;
  public tmpPathLocal = '/tmp/uploads';
  public tmpPathS3 = 'tmp';
  public tmpPath: string;

  /**
   * Validate storage provider, ensure upload path exists, and configure S3 client
   */
  async onModuleInit() {
    switch (config.STORAGE_PROVIDER) {
      case StorageProviderEnum.LOCAL:
        // Set paths
        this.uploadPath = this.uploadPathLocal;
        this.tmpPath = this.tmpPathLocal;
        // Ensure paths exist
        await fs.ensureDir(this.uploadPath);
        await fs.ensureDir(this.tmpPath);
        break;

      case StorageProviderEnum.S3:
        // Create S3 client
        this.logger.verbose(`📂 Setting up S3 client`);
        this.s3 = new S3({
          endpoint: config.AWS_S3_ENDPOINT,
          region: config.AWS_REGION,
          credentials: {
            accessKeyId: config.AWS_ACCESS_KEY_ID,
            secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
          },
        });
        // Set paths
        this.uploadPath = this.uploadPathS3;
        this.tmpPath = this.tmpPathS3;
        break;

      default:
        throw new Error(`Storage provider ${config.STORAGE_PROVIDER} is not supported`);
    }
  }

  /**
   * Remove old files from temp path every hour
   */
  @Cron(CronExpression.EVERY_HOUR)
  async removeOldFiles() {
    this.logger.verbose('📂 Checking for old files to remove from temp path');

    // Set cutoff to be an hour ago
    const livesUntil = Date.now() - 3600000;
    let count = 0;

    switch (config.STORAGE_PROVIDER) {
      case StorageProviderEnum.LOCAL:
        // Get all files in the temp path that are older than an hour
        const files = await fs.readdir(this.tmpPath);

        for (const file of files) {
          const path = `${this.tmpPath}/${file}`;
          const stats = await fs.stat(path);
          // Check if the file is older than the cutoff
          if (stats.mtimeMs < livesUntil) {
            this.logger.verbose(`📂 Removing old file ${path}`);
            await fs.remove(path);
            count++;
          }
        }
        break;

      case StorageProviderEnum.S3:
        // Get all files in the temp path that are older than an hour
        const list = await this.s3.send(new ListObjectsCommand({ Bucket: config.AWS_S3_BUCKET, Prefix: this.tmpPath }));
        const keys = list.Contents.map((item) => item.Key);

        for (const key of keys) {
          const stats = await this.s3.send(new HeadObjectCommand({ Bucket: config.AWS_S3_BUCKET, Key: key }));
          // Check if the file is older than the cutoff
          if (stats.LastModified.getTime() < livesUntil) {
            this.logger.verbose(`📂 Removing old file ${key}`);
            await this.deleteS3(key);
            count++;
          }
        }
        break;

      default:
        throw new Error(`Storage provider ${config.STORAGE_PROVIDER} is not supported`);
    }

    this.logger.verbose(`📂 Removed ${count} old files from temp path`);
  }

  /**
   * Get file from storage
   * @param key - The key of the file
   * @returns The file body
   */
  getFile(key: string): Promise<Buffer> {
    switch (config.STORAGE_PROVIDER) {
      case StorageProviderEnum.LOCAL:
        return this.getFileLocal(key);

      case StorageProviderEnum.S3:
        return this.getFileS3(key);

      default:
        throw new Error(`Storage provider ${config.STORAGE_PROVIDER} is not supported`);
    }
  }

  /**
   * Get file from local storage
   * @param filePath - The path to the file
   * @returns The file body
   */
  async getFileLocal(filePath: string): Promise<Buffer> {
    this.logger.verbose(`📂 Getting file "${filePath}" from local storage`);

    // Check that the file exists
    if (!(await fs.stat(filePath))) {
      throw new NotFoundException(`File "${filePath}" not found`);
    }

    // Get the file
    const file = await fs.readFile(filePath);
    this.logger.debug(`✅️ Retrieved file "${filePath}" from temp path`);

    return file;
  }

  /**
   * Get file from S3 storage
   * @param key - The key of the file
   * @returns The file body
   */
  async getFileS3(key: string): Promise<Buffer> {
    this.logger.verbose(`📂 Getting file "${key}" from S3`);

    // Get the file
    const file = await this.s3.send(new GetObjectCommand({ Bucket: config.AWS_S3_BUCKET, Key: key }));
    this.logger.debug(`✅️ Retrieved file "${key}" from S3`);

    // Convert to buffer
    const response = file.Body as Readable;
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      response.on('data', (chunk) => chunks.push(chunk as Buffer));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', (err) => reject(err));
    });

    return buffer;
  }

  /**
   * Get file stream from storage
   * @param key - The key of the file
   * @param newKey - The new key of the file
   * @param contentType - The content type of the file
   * @returns The new file path
   */
  moveFile(key: string, newKey: string, contentType: string): Promise<string> {
    switch (config.STORAGE_PROVIDER) {
      case StorageProviderEnum.LOCAL:
        return this.moveFileLocal(key, newKey);

      case StorageProviderEnum.S3:
        return this.moveFileS3(key, newKey, contentType);

      default:
        throw new Error(`Storage provider ${config.STORAGE_PROVIDER} is not supported`);
    }
  }

  /**
   * Move a file in local storage
   * @param key - The key of the file
   * @param newKey - The new key of the file
   * @returns The new file path
   */
  async moveFileLocal(key: string, newKey: string): Promise<string> {
    this.logger.verbose(`📂 Moving file "${key}" to "${newKey}" in local storage`);

    // Check that the file exists
    if (!(await fs.stat(key))) {
      throw new NotFoundException(`File "${key}" not found`);
    }

    // Move the file
    await fs.move(key, newKey);
    this.logger.debug(`✅️ Moved file "${key}" to "${newKey}" in local storage`);

    return `${config.HOST}${newKey}`;
  }

  /**
   * Move a file in S3 storage
   * @param key - The key of the file
   * @param newKey - The new key of the file
   * @param contentType - The content type of the file
   * @returns The new file path
   */
  async moveFileS3(key: string, newKey: string, contentType: string): Promise<string> {
    this.logger.verbose(`📂 Moving file "${key}" to "${newKey}" in S3`);

    // Copy the file
    await this.s3.send(
      new CopyObjectCommand({
        Bucket: config.AWS_S3_BUCKET,
        ContentType: contentType,
        CopySource: `${config.AWS_S3_BUCKET}/${key}`,
        Key: newKey,
        ACL: 'public-read',
      }),
    );
    this.logger.debug(`✅️ Copied file "${key}" to "${newKey}" in S3`);

    // Delete the old file
    await this.deleteS3(key);

    return `${config.AWS_S3_URL}/${newKey}`;
  }

  /**
   * Upload a file to storage
   * @param key - The key of the file
   * @param body - The body of the file
   * @param contentType - The content type of the file
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
   * @param filePath - The key of the file
   * @param body - The body of the file
   * @returns The created file URL
   */
  async uploadLocal(filePath: string, body: Buffer): Promise<string> {
    this.logger.verbose(`📂 Uploading file "${filePath} to local storage`);
    try {
      // Get proceeding directories
      const directory = filePath.split('/').slice(0, -1).join('/');

      // Ensure upload directory exists
      await fs.ensureDir(directory);

      // Write file to disk
      await fs.writeFile(filePath, body);

      // Return public file URL
      this.logger.debug(`✅️ Uploaded file "${filePath}" to local storage`);
      return `${config.HOST}${filePath}`;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Upload a file to S3
   * @param key - The key of the file
   * @param body - The body of the file
   * @param contentType - The content type of the file
   * @returns The created file URL
   */
  async uploadS3(key: string, body: Buffer, contentType: string): Promise<string> {
    this.logger.verbose(`📂 Uploading file "${key} to S3`);
    try {
      // Upload file to S3
      const upload = new Upload({
        client: this.s3,
        params: {
          Bucket: config.AWS_S3_BUCKET,
          Key: key,
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
      return `${config.AWS_S3_URL}/${key}`;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Delete a file from storage
   * @param key - The key of the file
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
   * @param filePath - The key of the file
   */
  async deleteLocal(filePath: string): Promise<void> {
    this.logger.verbose(`📂 Deleting file "${filePath} from local storage`);
    try {
      // Get proceeding directories
      const directory = filePath.split('/').slice(0, -1).join('/');

      // Ensure upload directory exists
      await fs.ensureDir(directory);

      // Remove file from disk
      await fs.remove(filePath);

      // Remove directory if empty
      if ((await fs.readdir(directory)).length === 0 && directory !== this.uploadPath && directory !== this.tmpPath) {
        try {
          await fs.remove(directory);
        } catch (e) {}
      }

      this.logger.debug(`✅️ Deleted file "${filePath}" from local storage`);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Delete a file from S3
   * @param key - The key of the file
   */
  async deleteS3(key: string): Promise<void> {
    this.logger.verbose(`📂 Deleting file "${key} from S3`);
    try {
      // Remove file from S3
      await this.s3.send(new DeleteObjectCommand({ Bucket: config.AWS_S3_BUCKET, Key: key }));

      this.logger.debug(`✅️ Deleted file "${key}" from S3`);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
