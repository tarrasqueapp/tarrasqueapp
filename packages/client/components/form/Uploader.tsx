import { CloudUpload, Delete } from '@mui/icons-material';
import { Box, CircularProgress, IconButton, Typography, alpha } from '@mui/material';
import Uppy, { UploadResult } from '@uppy/core';
import Tus from '@uppy/tus';
import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

import { config } from '../../lib/config';
import { Color } from '../../lib/enums';
import { FileInterface } from '../../lib/types';
import { store } from '../../store';

export interface UploaderProps {
  value?: FileInterface | string;
  allowedFileTypes?: string[] | null;
  onChange?: (file?: FileInterface) => void;
}

export const Uploader: React.FC<UploaderProps> = ({ value, allowedFileTypes, onChange }) => {
  const [file, setFile] = useState<FileInterface | string | undefined>(value);
  const [preview, setPreview] = useState('');
  const [progress, setProgress] = useState(0);
  const [progressVisible, setProgressVisible] = useState(false);

  // Setup Uppy
  const uppy = useMemo(() => {
    return new Uppy({ restrictions: { allowedFileTypes, maxNumberOfFiles: 1 }, autoProceed: false })
      .use(Tus, { chunkSize: 1e6, endpoint: config.TUS_URL })
      .on('progress', (p) => progress !== p && setProgress(p))
      .on('complete', () => setProgress(100))
      .on('error', () => setProgress(0));
  }, []);

  // Returnd the file object when the upload is complete
  useEffect(() => {
    if (!uppy || !onChange) return;

    async function handleComplete(result: UploadResult<Record<string, unknown>, Record<string, unknown>>) {
      if (!onChange || !result.successful.length) return;
      const uppyFile = result.successful[0];

      if (!uppyFile.type) {
        toast.error('Unknown file type');
        return;
      }

      let file: FileInterface = {
        name: uppyFile.uploadURL.replace(config.TUS_URL, ''),
        type: uppyFile.type,
        extension: uppyFile.extension,
        size: uppyFile.size,
        data: uppyFile.data,
      };

      // Get the dimensions if the file is an image or a video
      if (uppyFile.type.startsWith('image')) {
        const dimensions = await store.media.getImageDimensions(uppyFile.data);
        file = { ...file, ...dimensions };
      } else if (uppyFile.type.startsWith('video')) {
        const dimensions = await store.media.getVideoDimensions(uppyFile.data);
        file = { ...file, ...dimensions };
      }

      setFile(file);
      onChange(file);
    }

    uppy.on('complete', handleComplete);

    return () => {
      uppy.off('complete', handleComplete);
    };
  }, [uppy]);

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
  useEffect(() => {
    if (!value) {
      setFile(undefined);
      setPreview('');
    } else if (typeof value === 'object' && value.data) {
      setFile(value);
      setPreview(URL.createObjectURL(value.data));
    } else if (typeof value === 'string') {
      setFile(undefined);
      setPreview(value);
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
      const objectUrl = URL.createObjectURL(acceptedFile);
      setPreview(objectUrl);

      const file = {
        name: acceptedFile.name,
        type: acceptedFile.type,
        extension: acceptedFile.name.split('.').pop() || '',
        size: acceptedFile.size,
        data: acceptedFile,
      };
      setFile(file);

      uppy.reset();
      uppy.addFile(file);
      uppy.upload();
    },
  });

  /**
   * Remove the file from the uploader and reset the Uppy instance
   * @param event The event that triggered the delete
   */
  function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setPreview('');
    setFile(undefined);
    setProgress(0);
    onChange && onChange(undefined);
    uppy.reset();
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: `2px dashed ${isDragActive && !isDragReject ? alpha(Color.Brown, 0.6) : alpha(Color.Brown, 0.4)}`,
        background: isDragActive && !isDragReject ? alpha(Color.Brown, 0.05) : undefined,
        cursor: 'pointer',
        position: 'relative',
        p: 4,
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
          <IconButton onClick={handleDelete} sx={{ position: 'absolute', top: 4, right: 4 }}>
            <Delete color="error" />
          </IconButton>

          {preview ? <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} /> : 'no preview'}
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
