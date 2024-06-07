import { Dimensions, FileEntity } from '@tarrasque/common';
import { UploadedUppyFile, UppyFile } from '@uppy/core';

import { Media } from '@/actions/media';

export type UploadingFile = UppyFile<Record<string, unknown>, Record<string, unknown>> & {
  progress?: { percentage: number };
  uploadURL?: string;
};

export type UploadedFile = UploadedUppyFile<Record<string, unknown>, Record<string, unknown>>;

export class MediaUtils {
  /**
   * Convert an Uppy file to a FileEntity
   * @param uppyFile - The Uppy file to convert
   * @returns The converted file
   * @throws Error
   */
  static async convertUppyToFile(uppyFile: UploadedFile): Promise<FileEntity> {
    // Get the id from the file name (object_id.extension)
    const id = uppyFile.name.split('.')[0]!;
    const objectName = uppyFile.meta.objectName as string;

    let file: FileEntity = {
      id,
      url: objectName,
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
  static isImage(file?: FileEntity | UploadingFile): boolean {
    if (!file) return false;
    return file.type?.startsWith('image/') || false;
  }

  /**
   * Check if file is a video
   * @param file - The file to check
   * @returns If the file is a video
   */
  static isVideo(file?: FileEntity | UploadingFile): boolean {
    if (!file) return false;
    return file.type?.startsWith('video/') || false;
  }

  /**
   * Check if file is an uploaded Uppy file
   * @param file - The file to check
   * @returns If the file is an uploaded Uppy file
   */
  static isUploadedFile(file: unknown): file is UploadedFile {
    return (file as UploadingFile)?.uploadURL !== undefined;
  }

  /**
   * Check if file is an Uppy file that may currently be uploading
   * @param file - The file to check
   * @returns If the file is an uploading Uppy file
   */
  static isUploadingFile(file: unknown): file is UploadingFile {
    return (file as UploadingFile)?.data !== undefined;
  }

  /**
   * Check if file is a Media entity
   * @param file - The file to check
   * @returns If the file is a Media entity
   */
  static isMedia(file: unknown): file is Media {
    return (file as Media)?.user_id !== undefined;
  }

  /**
   * Convert bytes to a human readable string
   * @param bytes - The bytes to convert
   * @param decimals - The number of decimals
   * @returns The human readable string
   */
  static formatBytes(bytes: number, decimals = 2) {
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
  static getImageDimensions(file: File | Blob): Promise<Dimensions> {
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
  static getVideoDimensions(file: File | Blob): Promise<Dimensions> {
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
