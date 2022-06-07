import Uppy from '@uppy/core';
import ImageEditor from '@uppy/image-editor';
import { Dashboard } from '@uppy/react';
import { DashboardProps } from '@uppy/react/src/Dashboard';
import Tus from '@uppy/tus';
import React, { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

import { config } from '../../lib/config';
import { FileInterface } from '../../lib/types';
import { store } from '../../store';

export interface UploaderProps {
  allowedFileTypes?: string[] | null | undefined;
  onUploadComplete?: (file: FileInterface) => void;
  DashboardProps?: Omit<DashboardProps, 'uppy'>;
}

export const Uploader: React.FC<UploaderProps> = ({ allowedFileTypes, onUploadComplete, DashboardProps }) => {
  const uppy = useMemo(() => {
    return new Uppy({
      restrictions: {
        allowedFileTypes,
        maxNumberOfFiles: 1,
      },
      autoProceed: false,
    })
      .use(Tus, { endpoint: config.TUS_URL, onShouldRetry: () => true })
      .use(ImageEditor, {
        quality: 1,
        cropperOptions: {
          viewMode: 1,
          background: false,
          autoCropArea: 1,
          responsive: true,
          croppedCanvasOptions: {},
        },
      });
  }, []);

  useEffect(() => {
    if (!uppy) return;
    if (onUploadComplete)
      uppy.on('complete', async (result) => {
        if (!result.successful.length) return;
        const file = result.successful[0];
        console.log(file);

        let dimensions = { width: 0, height: 0 };
        if (file.type?.startsWith('image')) {
          dimensions = await store.media.getImageDimensions(file.data);
        } else if (file.type?.startsWith('video')) {
          dimensions = await store.media.getVideoDimensions(file.data);
        } else {
          toast.error('Unsupported file type');
          throw new Error('Unsupported file type');
        }

        const name = file.uploadURL.replace(config.TUS_URL, '');
        const { extension, type, size } = file;

        onUploadComplete({ name, extension, type, size, ...dimensions });
      });
  }, [uppy]);

  return (
    <Dashboard
      uppy={uppy}
      theme="dark"
      plugins={['ImageEditor']}
      proudlyDisplayPoweredByUppy={false}
      {...DashboardProps}
    />
  );
};
