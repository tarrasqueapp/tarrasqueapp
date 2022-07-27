import { useMutation } from '@tanstack/react-query';

import { api } from '../../../lib/api';
import { FileInterface, MediaInterface } from '../../../lib/types';

/**
 * Send a request to create a media item
 * @param file - The uploaded file
 * @returns The created media
 */
async function createMedia(file: Partial<FileInterface>) {
  const { data } = await api.post<MediaInterface>(`/api/media`, file);
  return data;
}

/**
 * Create a media item
 * @returns Media create mutation
 */
export function useCreateMedia() {
  return useMutation(createMedia);
}
