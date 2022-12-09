import { CloudUpload, Delete } from '@mui/icons-material';
import { Box, CircularProgress, IconButton, Typography, alpha } from '@mui/material';
import Uppy, { UploadResult } from '@uppy/core';
import Tus from '@uppy/tus';
import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { useEffectAsync } from '../../hooks/useEffectAsync';
import { Color } from '../../lib/colors';
import { FileInterface } from '../../lib/types';
import { store } from '../../store';

export interface UploaderProps {
  value?: FileInterface | string;
  allowedFileTypes?: string[] | null;
  onChange?: (file?: FileInterface) => void;
}

export const Uploader: React.FC<UploaderProps> = ({ value, allowedFileTypes, onChange }) => {
  const [file, setFile] = useState<FileInterface | undefined>();
  const [preview, setPreview] = useState('');
  const [progress, setProgress] = useState(0);
  const [progressVisible, setProgressVisible] = useState(false);

  // Setup Uppy
  const uppy = useMemo(() => {
    return new Uppy({ restrictions: { allowedFileTypes, maxNumberOfFiles: 1 }, autoProceed: false })
      .use(Tus, { chunkSize: 1e6, endpoint: '/tus/files/' })
      .on('progress', (p) => progress !== p && setProgress(p))
      .on('error', () => {
        setProgress(0);
        onChange?.(undefined);
      })
      .on('complete', async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
        if (!result.successful.length) return;
        const uppyFile = result.successful[0];
        const file = await store.media.convertUppyToFile(uppyFile);
        setProgress(100);
        onChange?.(file);
      });
  }, [onChange]);

  // Hide progress bar when upload is complete
  useEffect(() => {
    setProgressVisible(true);
    setTimeout(() => {
      if (progress === 100) {
        setProgressVisible(false);
      }
    }, 1000);
  }, [progress]);

  // Set the preview image when a file is passed in
  useEffectAsync(async () => {
    if (!value) {
      setFile(undefined);
      setPreview('');
      return;
    }

    if (typeof value === 'object' && 'data' in value) {
      setFile(value);
      const objectUrl = URL.createObjectURL(value.data);
      setPreview(store.media.isMedia(value) ? objectUrl : '');
      return;
    }

    if (typeof value === 'string') {
      const file = await store.media.urlToFile(value);
      setFile({ name: file.name, type: file.type, extension: '', size: file.size, data: file });
      setPreview(store.media.isMedia(file) ? value : '');
    }
  }, [value]);

  // Setup the dropzone
  const accept: Record<string, string[]> = {};
  allowedFileTypes?.forEach((allowedFileType) => (accept[allowedFileType] = []));
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept,
    multiple: false,
    onDropAccepted(acceptedFiles) {
      setProgress(0);

      const acceptedFile = acceptedFiles[0];
      if (store.media.isMedia(acceptedFile)) {
        const objectUrl = URL.createObjectURL(acceptedFile);
        setPreview(objectUrl);
      } else {
        setPreview('');
      }

      const file = {
        name: acceptedFile.name,
        type: acceptedFile.type,
        extension: acceptedFile.name.split('.').pop() || '',
        size: acceptedFile.size,
        data: acceptedFile,
      };
      setFile(file);

      uppy.cancelAll();
      uppy.addFile(file);
      uppy.upload();
    },
  });

  /**
   * Remove the file from the uploader and reset the Uppy instance
   * @param event - The event that triggered the delete
   */
  function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setPreview('');
    setFile(undefined);
    setProgress(0);
    onChange?.(undefined);
    uppy.cancelAll();
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: `1px dashed ${isDragActive && !isDragReject ? alpha(Color.Brown, 0.6) : alpha(Color.Grey, 0.4)}`,
        background: isDragActive && !isDragReject ? alpha(Color.Brown, 0.05) : undefined,
        cursor: 'pointer',
        position: 'relative',
        p: file ? 0 : 4,
        borderRadius: 1,
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />

      {progressVisible && (
        <CircularProgress
          color="success"
          variant="determinate"
          value={progress}
          sx={{ position: 'absolute', top: 4, right: 4 }}
        />
      )}

      {file ? (
        <>
          <IconButton
            onClick={handleDelete}
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              background: 'rgba(0, 0, 0, 0.6)',
              '&:hover': { background: 'rgba(0, 0, 0, 0.8)' },
            }}
          >
            <Delete color="error" />
          </IconButton>

          {preview ? (
            <>
              {store.media.isImage(file) && (
                <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
              )}

              {store.media.isVideo(file) && (
                <video controls src={preview} style={{ maxWidth: '100%', maxHeight: '100%' }} />
              )}
            </>
          ) : (
            file.name
          )}
        </>
      ) : (
        <>
          <CloudUpload fontSize="large" htmlColor={Color.Brown} sx={{ margin: '0 auto' }} />

          <Typography variant="h4" sx={{ mt: 2 }} align="center">
            {isDragActive && !isDragReject && 'Drop the file here'}
            {isDragReject && 'File type not accepted'}
            {!isDragActive && 'Click to select or drag and drop'}
          </Typography>
        </>
      )}
    </Box>
  );
};
