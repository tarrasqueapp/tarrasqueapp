import { UploadedUppyFile, UppyFile } from '@uppy/core';
import { makeAutoObservable } from 'mobx';

import { config } from '@tarrasque/common';
import { DimensionsEntity, FileEntity, MediaEntity } from '@tarrasque/common';

export type UploadingFile = UppyFile<Record<string, unknown>, Record<string, unknown>> & {
  progress?: { percentage: number };
  uploadURL?: string;
};

export type UploadedFile = UploadedUppyFile<Record<string, unknown>, Record<string, unknown>>;

class MediaStore {
  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Get the file name from the upload URL
   * @param url - The upload URL
   * @returns The file name
   */
  getFileNameFromUploadUrl(url: string): string {
    return url.replace(`${config.HOST}/tus/files/`, '').split('+')[0];
  }

  /**
   * Convert an Uppy file to a FileEntity
   * @param uppyFile - The Uppy file to convert
   * @returns The converted file
   * @throws Error
   */
  async convertUppyToFile(uppyFile: UploadedFile): Promise<FileEntity> {
    const id = this.getFileNameFromUploadUrl(uppyFile.uploadURL);

    let file: FileEntity = {
      id,
      name: uppyFile.name,
      type: uppyFile.type!,
      extension: uppyFile.extension,
      size: uppyFile.size,
    };

    // Get the dimensions if the file is an image or a video
    if (this.isImage(uppyFile)) {
      const dimensions = await this.getImageDimensions(uppyFile.data);
      file = { ...file, ...dimensions };
    } else if (this.isVideo(uppyFile)) {
      const dimensions = await this.getVideoDimensions(uppyFile.data);
      file = { ...file, ...dimensions };
    }

    return file;
  }

  /**
   * Check if file is an image
   * @param file - The file to check
   * @returns If the file is an image
   */
  isImage(file?: FileEntity | UploadingFile): boolean {
    if (!file) return false;
    return file.type?.startsWith('image/') || false;
  }

  /**
   * Check if file is a video
   * @param file - The file to check
   * @returns If the file is a video
   */
  isVideo(file?: FileEntity | UploadingFile): boolean {
    if (!file) return false;
    return file.type?.startsWith('video/') || false;
  }

  /**
   * Check if file is an uploaded Uppy file
   * @param file - The file to check
   * @returns If the file is an uploaded Uppy file
   */
  isUploadedFile(file: unknown): file is UploadedFile {
    return (file as UploadingFile)?.uploadURL !== undefined;
  }

  /**
   * Check if file is an Uppy file that may currently be uploading
   * @param file - The file to check
   * @returns If the file is an uploading Uppy file
   */
  isUploadingFile(file: unknown): file is UploadingFile {
    return (file as UploadingFile)?.data !== undefined;
  }

  /**
   * Check if file is of MediaEntity
   * @param file - The file to check
   * @returns If the file is of MediaEntity
   */
  isMedia(file: unknown): file is MediaEntity {
    return (file as MediaEntity)?.thumbnailUrl !== undefined;
  }

  /**
   * Convert bytes to a human readable string
   * @param bytes - The bytes to convert
   * @param decimals - The number of decimals
   * @returns The human readable string
   */
  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * Get image dimensions
   * @param file - The image file
   * @returns The image dimensions
   */
  getImageDimensions(file: File | Blob): Promise<DimensionsEntity> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        const image = new Image();
        image.src = reader.result as string;

        image.addEventListener('load', () => {
          resolve({ width: image.width, height: image.height });
        });
      });

      reader.readAsDataURL(file);
    });
  }

  /**
   * Get video dimensions
   * @param file - The video file
   * @returns The video dimensions
   */
  getVideoDimensions(file: File | Blob): Promise<DimensionsEntity> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        const video = document.createElement('video');
        video.src = reader.result as string;

        video.addEventListener('loadedmetadata', () => {
          resolve({ width: video.videoWidth, height: video.videoHeight });
        });
      });

      reader.readAsDataURL(file);
    });
  }
}

export const mediaStore = new MediaStore();
