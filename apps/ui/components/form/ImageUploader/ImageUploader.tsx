import { CloudUpload, Delete } from '@mui/icons-material';
import { Box, Button, IconButton, Typography, alpha } from '@mui/material';
import Uppy, { FileProgress, SuccessResponse } from '@uppy/core';
import Tus from '@uppy/tus';
import React, { useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

import { Color } from '../../../lib/colors';
import { MediaInterface } from '../../../lib/types';
import { store } from '../../../store';
import { UploadingFile } from '../../../store/media';
import { MathUtils } from '../../../utils/MathUtils';
import { CircularProgressWithLabel } from '../../common/CircularProgressWithLabel';

export interface ImageUploaderProps {
  file?: UploadingFile | MediaInterface;
  onChange?: (file: UploadingFile | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ file, onChange }) => {
  const allowedFileTypes = ['image/*'];

  // Setup the uploader
  const uppy = useMemo(() => {
    return (
      new Uppy({ restrictions: { allowedFileTypes, maxNumberOfFiles: 1 }, autoProceed: true })
        // Add the tus plugin
        .use(Tus, { chunkSize: 1e6, endpoint: '/tus/files/' })
    );
  }, []);

  // Setup the dropzone
  const accept: Record<string, string[]> = {};
  allowedFileTypes?.forEach((allowedFileType) => (accept[allowedFileType] = []));
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept,
    multiple: false,
    onDropAccepted: handleSelect,
  });

  /**
   * Handle the file being added to the uploader
   * @param file - The file that was added
   */
  function handleFileAdded(file: UploadingFile) {
    if (!file) return;
    onChange?.(file);
  }

  /**
   * Update the file with the upload progress
   * @param file - The file that is being uploaded
   * @param progress - The progress of the upload
   */
  function handleUploadProgress(file: UploadingFile | undefined, progress: FileProgress) {
    if (!file) return;
    const percentage = MathUtils.getPercentage(progress.bytesUploaded, progress.bytesTotal);
    onChange?.({ ...file, progress: { ...file.progress!, percentage } });
  }

  /**
   * Update the file with the upload URL and set the progress to 100%
   * @param file - The file that was uploaded
   * @param response - The response from the server
   */
  function handleUploadSuccess(file: UploadingFile | undefined, response: SuccessResponse) {
    if (!file) return;
    onChange?.({ ...file, progress: { ...file.progress!, percentage: 100 }, uploadURL: response.uploadURL });
  }

  /**
   * Clear the files when an error occurs
   */
  function handleError() {
    onChange?.(null);
  }

  // Setup the event listeners
  useEffect(() => {
    uppy.once('file-added', handleFileAdded);
    uppy.once('upload-progress', handleUploadProgress);
    uppy.once('upload-success', handleUploadSuccess);
    uppy.once('error', handleError);

    return () => {
      uppy.off('file-added', handleFileAdded);
      uppy.off('upload-progress', handleUploadProgress);
      uppy.off('upload-success', handleUploadSuccess);
      uppy.off('error', handleError);
    };
  }, [file, onChange]);

  /**
   * Select the file and add them to the uploader
   * @param acceptedFiles - The files that were selected
   */
  function handleSelect(acceptedFiles: File[]) {
    // Convert the file to the format that Uppy expects
    const files = acceptedFiles.map((file) => ({
      name: file.name,
      type: file.type,
      extension: file.name.split('.').pop() || '',
      size: file.size,
      data: file,
    }));

    // Remove all the files from the uploader
    uppy.cancelAll();

    // Remove all the files from the uploads list
    onChange?.(null);

    // Add the files to the uploader
    try {
      uppy.addFile(files[0]);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Remove the file from the uppy instance and the uploads list
   * @param file
   * @returns
   */
  function handleDelete(file: UploadingFile | MediaInterface) {
    if (!file) return;
    if (store.media.isUploadingFile(file)) uppy.removeFile(file.id);
    onChange?.(null);
  }

  const borderColor = isDragActive && !isDragReject ? alpha(Color.Brown, 0.6) : 'rgba(0, 0, 0, 0.19)';

  return (
    <Box>
      <Box sx={{ position: 'relative' }}>
        <Button
          fullWidth
          sx={{
            m: 0.2,
            p: 0.5,
            overflow: 'hidden',
            textTransform: 'none',
            color: Color.White,
            borderRadius: '50%',

            background: 'rgba(255, 255, 255, 0.09)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.13)',
            },
          }}
        >
          <Box
            sx={{
              borderRadius: '50%',
              border: `3px dashed ${borderColor}`,
              display: 'flex',
              flexDirection: 'column',
              flex: '1 0 auto',
              alignItems: 'center',
              justifyContent: 'center',
              background: isDragActive && !isDragReject ? alpha(Color.Brown, 0.05) : undefined,
              overflow: 'hidden',
              flexWrap: 'wrap',
              height: 200,
              width: '100%',
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />

            {store.media.isUploadingFile(file) && (
              <>
                {store.media.isUploadedFile(file) ? (
                  <Box component="img" src={file.uploadURL} height={200} />
                ) : (
                  <Box>
                    {file.progress && (
                      <CircularProgressWithLabel
                        color={file.progress.percentage === 100 && file.uploadURL ? 'success' : 'info'}
                        value={file.progress.percentage || 0}
                      />
                    )}
                  </Box>
                )}
              </>
            )}

            {store.media.isMedia(file) && (
              <>{file.thumbnailUrl && <Box component="img" src={file.thumbnailUrl} height={200} />}</>
            )}

            {!file && (
              <Box sx={{ p: 4 }}>
                <CloudUpload fontSize="large" htmlColor={Color.BrownLight} sx={{ mt: -2 }} />

                <Typography variant="h5" sx={{ mt: 2 }}>
                  {isDragActive && !isDragReject && 'Drop the file here'}
                  {isDragReject && 'File type not accepted'}
                  {!isDragActive && 'Click to select or drag and drop'}
                </Typography>
              </Box>
            )}
          </Box>
        </Button>

        {file && (
          <IconButton
            color="error"
            sx={{ position: 'absolute', top: 4, right: 4, zIndex: 1 }}
            onClick={() => handleDelete(file)}
          >
            <Delete />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};
