import { UppyFile } from '@uppy/core';
import { makeAutoObservable } from 'mobx';

import { DimensionsInterface, FileInterface } from '../lib/types';

class MediaStore {
  constructor() {
    makeAutoObservable(this);
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
