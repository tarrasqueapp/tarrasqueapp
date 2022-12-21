import { Box } from '@mui/material';
import Uppy, { FileProgress, SuccessResponse, UppyFile } from '@uppy/core';
import Tus from '@uppy/tus';
import React, { useEffect, useMemo } from 'react';

import { MathUtils } from '../../../utils/MathUtils';
import { Dropzone } from './Dropzone';
import { FileList, FileListProps } from './FileList';

export type FileUpload = UppyFile<Record<string, unknown>, Record<string, unknown>> & {
  progress?: { percentage: number };
  uploadURL?: string;
};

export type FileUploadFinished = FileUpload & { type: string; uploadURL: string };

export interface UploaderProps {
  value?: FileUpload[];
  onChange?: (files: FileUpload[]) => void;
  allowedFileTypes?: string[] | null;
  multiple?: boolean;
  FileListProps?: Partial<FileListProps>;
}

export const Uploader: React.FC<UploaderProps> = ({ value, onChange, allowedFileTypes, multiple, FileListProps }) => {
  const uppy = useMemo(() => {
    return (
      new Uppy({ restrictions: { allowedFileTypes, maxNumberOfFiles: multiple ? undefined : 1 }, autoProceed: true })
        // Add the tus plugin
        .use(Tus, { chunkSize: 1e6, endpoint: '/tus/files/' })
    );
  }, []);

  /**
   * Handle the file being added to the uploader
   * @param files - The files that were added
   */
  function handleFileAdded(file: FileUpload) {
    if (!file || !value) return;
    onChange?.([file, ...value]);
  }

  /**
   * Update the file with the upload progress
   * @param file - The file that is being uploaded
   * @param progress - The progress of the upload
   */
  function handleUploadProgress(file: FileUpload | undefined, progress: FileProgress) {
    if (!file || !value) return;
    const percentage = MathUtils.getPercentage(progress.bytesUploaded, progress.bytesTotal);
    onChange?.(value.map((f) => (f.id === file.id ? { ...file, progress: { ...file.progress!, percentage } } : f)));
  }

  /**
   * Update the file with the upload URL and set the progress to 100%
   * @param file - The file that was uploaded
   * @param response - The response from the server
   */
  function handleUploadSuccess(file: FileUpload | undefined, response: SuccessResponse) {
    if (!file || !value) return;
    onChange?.(
      value.map((f) =>
        f.id === file.id
          ? { ...file, progress: { ...file.progress!, percentage: 100 }, uploadURL: response.uploadURL }
          : f,
      ),
    );
  }

  /**
   * Clear the files when an error occurs
   */
  function handleError() {
    onChange?.([]);
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
  }, [value, onChange]);

  /**
   * Select the files and add them to the uploader
   * @param acceptedFiles - The files that were selected
   */
  function handleSelect(acceptedFiles: File[]) {
    // Convert the files to the format that Uppy expects
    const files = acceptedFiles.map((file) => ({
      name: file.name,
      type: file.type,
      extension: file.name.split('.').pop() || '',
      size: file.size,
      data: file,
    }));

    if (!multiple) {
      // Remove all the files from the uploader
      uppy.cancelAll();

      // Remove all the files from the uploads list
      onChange?.([]);
    }

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
  function handleDelete(file: FileUpload) {
    if (!value) return;
    uppy.removeFile(file.id);
    onChange?.(value.filter((f) => f.id !== file.id));
  }

  return (
    <Box>
      <Dropzone onSelect={handleSelect} allowedFileTypes={allowedFileTypes} />

      <FileList files={value} onDelete={handleDelete} {...FileListProps} />
    </Box>
  );
};
