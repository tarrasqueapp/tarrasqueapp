import { CloudUpload, Delete } from '@mui/icons-material';
import { Box, BoxProps, Button, ButtonProps, CircularProgress, IconButton, Typography, alpha } from '@mui/material';
import { logger } from '@tarrasque/sdk';
import { FileProgress, SuccessResponse, UploadResult, Uppy } from '@uppy/core';
import Tus from '@uppy/tus';
import NextImage from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

import { getSession } from '@/actions/auth';
import { Media } from '@/actions/media';
import { CircularProgressWithLabel } from '@/components/CircularProgressWithLabel';
import { useGetUser } from '@/hooks/data/auth/useGetUser';
import { useEffectAsync } from '@/hooks/useEffectAsync';
import { Color } from '@/utils/colors';
import { config } from '@/utils/config';
import { MathUtils } from '@/utils/helpers/math';
import { MediaUtils, UploadingFile } from '@/utils/helpers/media';
import { supabaseLoader } from '@/utils/supabase/loader';

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

export interface UploaderProps {
  file?: UploadingFile | Media;
  onChange?: (file: UploadingFile | null) => void;
  allowedFileTypes?: string[];
  showAllowedFileTypes?: boolean;
  ButtonProps?: ButtonProps;
  ContainerProps?: BoxProps;
}

export function Uploader({
  file,
  onChange,
  allowedFileTypes,
  showAllowedFileTypes,
  ButtonProps,
  ContainerProps,
}: UploaderProps) {
  const { data: user } = useGetUser();

  // Get the access token
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffectAsync(async () => {
    const { data: session } = await getSession();
    const accessToken = session?.access_token || null;
    setAccessToken(accessToken);
  }, []);

  // Setup the uploader
  const uppy = useMemo(() => {
    return (
      new Uppy({
        restrictions: { allowedFileTypes, maxNumberOfFiles: 1 },
        autoProceed: true,
      })
        // Add the tus plugin
        .use(Tus, {
          endpoint: `${config.SUPABASE_URL}/storage/v1/upload/resumable`,
          headers: {
            authorization: `Bearer ${accessToken}`,
            apikey: accessToken!,
          },
          uploadDataDuringCreation: true,
          chunkSize: 6 * 1024 * 1024,
          allowedMetaFields: ['bucketName', 'objectName', 'contentType', 'cacheControl'],
        })
    );
  }, [accessToken]);

  // Setup the dropzone
  const accept: Record<string, string[]> = {};
  allowedFileTypes?.forEach((allowedFileType) => (accept[allowedFileType] = []));
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept,
    multiple: false,
    onDropAccepted: handleDrop,
  });

  /**
   * Handle the file being added to the uploader
   * @param file - The file that was added
   */
  function handleFileAdded(file: UploadingFile) {
    if (!file || !user) return;

    const STORAGE_BUCKET = 'tarrasqueapp';
    const folder = user.id;
    const extension = file.extension || file.name.split('.').pop() || '';
    file.name = `${uuidv4()}.${extension}`;

    const supabaseMetadata = {
      bucketName: STORAGE_BUCKET,
      objectName: folder ? `${folder}/${file.name}` : file.name,
      contentType: file.type,
    };

    file.meta = {
      ...file.meta,
      ...supabaseMetadata,
    };

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
   * Update the upload URL to the storage URL
   * @param resul - The result of the upload
   */
  async function handleComplete(result: UploadResult) {
    const file = result.successful[0];
    if (!file) return;

    const objectName = file.meta.objectName as string;

    onChange?.({
      ...file,
      progress: { ...file.progress!, percentage: 100 },
      uploadURL: supabaseLoader({ src: objectName, width: 250 }),
    });
  }

  /**
   * Clear the files when an error occurs
   */
  function handleError(error: Error) {
    logger.error(error);
    onChange?.(null);
  }

  // Setup the event listeners
  useEffect(() => {
    uppy.on('file-added', handleFileAdded);
    uppy.on('upload-progress', handleUploadProgress);
    uppy.on('upload-success', handleUploadSuccess);
    uppy.on('error', handleError);
    uppy.on('complete', handleComplete);

    return () => {
      uppy.off('file-added', handleFileAdded);
      uppy.off('upload-progress', handleUploadProgress);
      uppy.off('upload-success', handleUploadSuccess);
      uppy.off('error', handleError);
      uppy.off('complete', handleComplete);
    };
  }, [uppy, file, onChange]);

  /**
   * Select the file and add them to the uploader
   * @param acceptedFiles - The files that were selected
   */
  function handleDrop(acceptedFiles: File[]) {
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
      uppy.addFile(files[0]!);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
      }
    }
  }

  /**
   * Remove the file from the uppy instance and the uploads list
   * @param file
   * @returns
   */
  function handleDelete(file: UploadingFile | Media) {
    if (!file) return;
    if (MediaUtils.isUploadingFile(file)) uppy.removeFile(file.id);
    onChange?.(null);
  }

  const borderColor = isDragActive && !isDragReject ? alpha(Color.BROWN_MAIN, 0.6) : 'rgba(0, 0, 0, 0.19)';

  return (
    <Box sx={{ position: 'relative' }}>
      <Button
        fullWidth
        {...ButtonProps}
        sx={{
          p: 0.5,
          overflow: 'hidden',
          textTransform: 'none',
          color: Color.WHITE_LIGHT,
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.09)',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.13)',
          },
          ...ButtonProps?.sx,
        }}
      >
        <Box
          {...ContainerProps}
          sx={{
            borderRadius: '10px',
            border: `3px dashed ${borderColor}`,
            display: 'flex',
            flexDirection: 'column',
            flex: '1 0 auto',
            alignItems: 'center',
            justifyContent: 'center',
            background: isDragActive && !isDragReject ? alpha(Color.BROWN_MAIN, 0.05) : undefined,
            overflow: 'hidden',
            flexWrap: 'wrap',
            height: 200,
            width: '100%',
            ...ContainerProps?.sx,
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />

          {MediaUtils.isUploadingFile(file) && (
            <>
              {MediaUtils.isUploadedFile(file) ? (
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

          {MediaUtils.isMedia(file) && (
            <>{file.url && <NextImage loader={supabaseLoader} src={file.url} width={200} height={200} alt="" />}</>
          )}

          {!file && (
            <Box sx={{ p: 4 }}>
              <CloudUpload fontSize="large" htmlColor={Color.SAND_LIGHT} sx={{ mt: -2 }} />

              <Typography variant="h5" sx={{ mt: 2 }}>
                {isDragActive && !isDragReject && 'Drop the file here'}
                {isDragReject && 'File type not accepted'}
                {!isDragActive && 'Click to select or drag and drop'}
              </Typography>

              {showAllowedFileTypes && (
                <Typography variant="subtitle2" color="text.secondary">
                  {allowedFileTypes && `Only ${generateFileTypesString(allowedFileTypes)} files are allowed`}
                </Typography>
              )}
            </Box>
          )}

          {/* Show a loading spinner if the access token is not available yet to avoid the user attempting to upload a file without the access to do so */}
          {!accessToken && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: alpha(Color.BLACK_LIGHT, 0.9),
              }}
            >
              <CircularProgress disableShrink />
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
  );
}
