import { CloudUpload, Delete } from '@mui/icons-material';
import { Box, Button, CircularProgress, IconButton, Typography, alpha, circularProgressClasses } from '@mui/material';
import Uppy, { UploadResult } from '@uppy/core';
import Tus from '@uppy/tus';
import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { useEffectAsync } from '../../hooks/useEffectAsync';
import { Color } from '../../lib/colors';
import { FileInterface, MediaInterface } from '../../lib/types';
import { store } from '../../store';

export interface UploaderProps {
  value?: FileInterface | MediaInterface | null;
  allowedFileTypes?: string[] | null;
  onChange?: (file?: FileInterface | null) => void;
  onUploading?: (uploading: boolean) => void;
}

export const Uploader: React.FC<UploaderProps> = ({ value, allowedFileTypes, onChange, onUploading }) => {
  const [file, setFile] = useState<FileInterface | null>(null);
  const [preview, setPreview] = useState('');
  const [progress, setProgress] = useState(0);
  const [progressVisible, setProgressVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Setup Uppy
  const uppy = useMemo(() => {
    return new Uppy({ restrictions: { allowedFileTypes, maxNumberOfFiles: 1 }, autoProceed: false })
      .use(Tus, { chunkSize: 1e6, endpoint: '/tus/files/' })
      .on('file-added', () => {
        setUploading(true);
        onUploading?.(true);
      })
      .on('progress', (p) => progress !== p && setProgress(p))
      .on('error', () => {
        setProgress(0);
        onChange?.(null);
        setUploading(false);
        onUploading?.(false);
      })
      .on('complete', async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
        if (!result.successful.length) return;
        const uppyFile = result.successful[0];
        const file = await store.media.convertUppyToFile(uppyFile);
        setProgress(100);
        onChange?.(file);
        setUploading(false);
        onUploading?.(false);
      });
  }, [onChange]);

  // Hide progress bar when upload is complete
  useEffect(() => {
    setProgressVisible(true);
    setTimeout(() => {
      if (progress === 100 && !uploading) {
        setProgressVisible(false);
      }
    }, 1000);
  }, [progress, uploading]);

  // Set the preview image when a file is passed in
  useEffectAsync(async () => {
    if (!value) {
      setFile(null);
      setPreview('');
      return;
    }

    // Check if the value is a file object
    if (typeof value === 'object' && 'data' in value) {
      setFile(value);
      const objectUrl = URL.createObjectURL(value.data);
      setPreview(store.media.isMedia(value) ? objectUrl : '');
      return;
    }

    // Check if the value is a media object
    if (typeof value === 'object' && 'thumbnailUrl' in value) {
      setPreview(value.thumbnailUrl);
      return;
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
    setFile(null);
    setProgress(0);
    onChange?.(null);
    uppy.cancelAll();
  }

  /**
   * Generate a string of file types that can be uploaded
   * @param fileTypes - The file types that can be uploaded
   * @returns A formatted string of file types
   */
  function generateFileTypesString(fileTypes: string[]) {
    if (!fileTypes.length) return '';

    // If the file type ends with /*, keep the part before the /*, otherwise convert it to an extension
    fileTypes = fileTypes.map((fileType) => {
      if (fileType.endsWith('/*')) return fileType.replace(/\/\*$/, '');
      return `.${fileType.replace(/.*\//, '')}`;
    });

    // Remove duplicates
    fileTypes = [...new Set(fileTypes)];

    // Generate the string
    if (fileTypes.length === 2) return fileTypes.join(' and ');
    if (fileTypes.length > 2) {
      return `${fileTypes.slice(0, -1).join(', ')}, and ${fileTypes.slice(-1)}`;
    }
    if (fileTypes.length === 1) return fileTypes[0];
    return '';
  }

  const borderColor = isDragActive && !isDragReject ? alpha(Color.Brown, 0.6) : 'rgba(255, 255, 255, 0.09)';
  const spacing = '20px';
  const dashLength = '30px';
  const borderWidth = '2px';

  const hasMedia = Boolean(file || preview);

  return (
    <Box sx={{ position: 'relative' }}>
      <Button
        fullWidth
        sx={{
          m: 0.2,
          p: 0,
          borderRadius: '10px',
          overflow: 'hidden',
          textTransform: 'none',
          color: Color.White,
          backgroundImage: `repeating-linear-gradient(0deg, ${borderColor}, ${borderColor} ${spacing}, transparent ${spacing}, transparent ${dashLength}, ${borderColor} ${dashLength}), repeating-linear-gradient(90deg, ${borderColor}, ${borderColor} ${spacing}, transparent ${spacing}, transparent ${dashLength}, ${borderColor} ${dashLength}), repeating-linear-gradient(180deg, ${borderColor}, ${borderColor} ${spacing}, transparent ${spacing}, transparent ${dashLength}, ${borderColor} ${dashLength}), repeating-linear-gradient(270deg, ${borderColor}, ${borderColor} ${spacing}, transparent ${spacing}, transparent ${dashLength}, ${borderColor} ${dashLength})`,
          backgroundSize: `${borderWidth} 100%, 100% ${borderWidth}, ${borderWidth} 100%, 100% ${borderWidth}`,
          backgroundPosition: '0 0, 0 0, 100% 0, 0 100%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1 0 auto',
            alignItems: 'center',
            justifyContent: 'center',
            background: isDragActive && !isDragReject ? alpha(Color.Brown, 0.05) : undefined,
            overflow: 'hidden',
            height: 200,
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />

          {preview ? (
            <>
              {(!file || (file && store.media.isImage(file))) && (
                <Box
                  component="img"
                  src={preview}
                  alt="Preview"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                />
              )}

              {file && store.media.isVideo(file) && (
                <Box
                  component="video"
                  controls
                  src={preview}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                />
              )}
            </>
          ) : (
            file?.name
          )}

          {!hasMedia && (
            <>
              <CloudUpload fontSize="large" htmlColor={Color.BrownLight} sx={{ mt: -2 }} />

              <Typography variant="h4" sx={{ mt: 2 }}>
                {isDragActive && !isDragReject && 'Drop the file here'}
                {isDragReject && 'File type not accepted'}
                {!isDragActive && 'Click to select or drag and drop'}
              </Typography>

              <Typography variant="caption">
                {allowedFileTypes && `Only ${generateFileTypesString(allowedFileTypes)} files are allowed`}
              </Typography>
            </>
          )}
        </Box>
      </Button>

      {progressVisible && (
        <CircularProgress
          color="success"
          variant="determinate"
          value={progress}
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            zIndex: 1,
            pointerEvents: 'none',
            [`&.${circularProgressClasses.root}`]: {
              color: '#00ff00',
            },
          }}
        />
      )}

      {hasMedia && (
        <IconButton
          onClick={handleDelete}
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            background: 'rgba(0, 0, 0, 0.5)',
            '&:hover': { background: 'rgba(0, 0, 0, 0.6)' },
          }}
        >
          <Delete color="error" />
        </IconButton>
      )}
    </Box>
  );
};
