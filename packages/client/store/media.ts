import { makeAutoObservable } from 'mobx';

import { DimensionsInterface } from '../lib/types';

class MediaStore {
  constructor() {
    makeAutoObservable(this);
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
