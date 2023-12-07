import { CloudUpload, Delete } from '@mui/icons-material';
import { Box, Button, IconButton, Typography, alpha } from '@mui/material';
import Uppy, { FileProgress, SuccessResponse, UploadResult } from '@uppy/core';
import Tus from '@uppy/tus';
import NextImage from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

import { getSession } from '../../../app/auth/actions';
import { useGetUser } from '../../../hooks/data/auth/useGetUser';
import { useEffectAsync } from '../../../hooks/useEffectAsync';
import { Color } from '../../../lib/colors';
import { config } from '../../../lib/config';
import { storageImageLoader } from '../../../lib/storageImageLoader';
import { MediaEntity } from '../../../lib/types';
import { store } from '../../../store';
import { UploadingFile } from '../../../store/media';
import { MathUtils } from '../../../utils/MathUtils';
import { CircularProgressWithLabel } from '../../common/CircularProgressWithLabel';

export interface ImageUploaderProps {
  file?: UploadingFile | MediaEntity;
  onChange?: (file: UploadingFile | null) => void;
}

export function ImageUploader({ file, onChange }: ImageUploaderProps) {
  const { data: user } = useGetUser();

  // Get the access token
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffectAsync(async () => {
    const session = await getSession();
    const accessToken = session?.access_token || null;
    setAccessToken(accessToken);
  }, []);

  const allowedFileTypes = ['image/*'];

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
    onDropAccepted: handleSelect,
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
      uploadURL: storageImageLoader({ src: objectName, width: 250 }),
    });
  }

  /**
   * Clear the files when an error occurs
   */
  function handleError() {
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
  function handleDelete(file: UploadingFile | MediaEntity) {
    if (!file) return;
    if (store.media.isUploadingFile(file)) uppy.removeFile(file.id);
    onChange?.(null);
  }

  const borderColor = isDragActive && !isDragReject ? alpha(Color.BROWN_BEIGE, 0.6) : 'rgba(0, 0, 0, 0.19)';

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
            color: Color.WHITE,
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
              background: isDragActive && !isDragReject ? alpha(Color.BROWN_BEIGE, 0.05) : undefined,
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
              <>
                {file.url && <NextImage loader={storageImageLoader} src={file.url} width={200} height={200} alt="" />}
              </>
            )}

            {!file && (
              <Box sx={{ p: 4 }}>
                <CloudUpload fontSize="large" htmlColor={Color.BROWN_LIGHT} sx={{ mt: -2 }} />

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
}
