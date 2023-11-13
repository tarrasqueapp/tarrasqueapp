import { useMutation } from '@tanstack/react-query';

import { FileEntity, MediaEntity } from '@tarrasque/sdk';

import { api } from '../../../lib/api';

/**
 * Send a request to create a media item
 * @param file - The uploaded file
 * @returns The created media
 */
async function createMedia(file: Partial<FileEntity>) {
  const { data } = await api.post<MediaEntity>(`/api/media`, file);
  return data;
}

/**
 * Create a media item
 * @returns Media create mutation
 */
export function useCreateMedia() {
  return useMutation({ mutationFn: createMedia });
}
