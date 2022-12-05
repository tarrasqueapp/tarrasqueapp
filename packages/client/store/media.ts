import { UploadedUppyFile, UppyFile } from '@uppy/core';
import { makeAutoObservable } from 'mobx';
import toast from 'react-hot-toast';

import { config } from '../lib/config';
import { DimensionsInterface, FileInterface } from '../lib/types';

class MediaStore {
  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Convert an Uppy file to a FileInterface
   * @param uppyFile - The Uppy file to convert
   * @returns file
   * @throws Error
   */
  async convertUppyToFile(
    uppyFile: UploadedUppyFile<Record<string, unknown>, Record<string, unknown>>,
  ): Promise<FileInterface | undefined> {
    if (!uppyFile.type) {
      toast.error('Unknown file type');
      return;
    }

    let file: FileInterface = {
      name: uppyFile.uploadURL.replace(`${config.HOST}/tus/files/`, ''),
      type: uppyFile.type,
      extension: uppyFile.extension,
      size: uppyFile.size,
      data: uppyFile.data,
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
   * @returns boolean
   */
  isImage(file?: FileInterface | File | Blob | UppyFile): boolean {
    if (!file) return false;
    return file.type?.startsWith('image/') || false;
  }

  /**
   * Check if file is a video
   * @param file - The file to check
   * @returns boolean
   */
  isVideo(file?: FileInterface | File | Blob | UppyFile): boolean {
    if (!file) return false;
    return file.type?.startsWith('video/') || false;
  }

  /**
   * Check if file is a media item
   * @param file - The file to check
   * @returns boolean
   */
  isMedia(file?: FileInterface | File | Blob | UppyFile): boolean {
    if (!file) return false;
    return this.isImage(file) || this.isVideo(file);
  }

  /**
   * Convert a URL to a File
   * @param url - The url of the file
   * @returns file
   */
  async urlToFile(url: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], 'file', { type: response.headers.get('content-type') || undefined });
  }

  /**
   * Get image dimensions
   * @param file - The image file
   * @returns dimensions
   */
  getImageDimensions(file: File | Blob): Promise<DimensionsInterface> {
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
   * @returns dimensions
   */
  getVideoDimensions(file: File | Blob): Promise<DimensionsInterface> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        const video = document.createElement('video');
        video.src = reader.result as string;

        video.addEventListener('loadedmetadata', function () {
          resolve({ width: video.videoWidth, height: video.videoHeight });
        });
      });

      reader.readAsDataURL(file);
    });
  }
}

export const mediaStore = new MediaStore();
