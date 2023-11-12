import {
  Add,
  Close,
  CloudUpload,
  Delete,
  Done,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  MoreHoriz,
  Visibility,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  MobileStepper,
  Popover,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material';
import Uppy, { FileProgress, SuccessResponse } from '@uppy/core';
import Tus from '@uppy/tus';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { Color } from '../../../lib/colors';
import { MediaEntity } from '../../../lib/types';
import { store } from '../../../store';
import { UploadingFile } from '../../../store/media';
import { MathUtils } from '../../../utils/MathUtils';
import { CircularProgressWithLabel } from '../../common/CircularProgressWithLabel';

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

export interface MediaUploaderProps {
  files?: (UploadingFile | MediaEntity)[];
  onChange?: (files: (UploadingFile | MediaEntity)[]) => void;
  selectedMediaId?: string;
  onSelect?: (file: UploadingFile | MediaEntity) => void;
}

export function MediaUploader({ files, onChange, selectedMediaId, onSelect }: MediaUploaderProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [adding, setAdding] = useState(false);

  const allowedFileTypes = ['image/*', 'video/*'];

  // Setup the uploader
  const uppy = useMemo(() => {
    return (
      new Uppy({ restrictions: { allowedFileTypes }, autoProceed: true })
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
    onDropAccepted: handleDrop,
  });

  /**
   * Handle the file being added to the uploader
   * @param file - The file that was added
   */
  function handleFileAdded(file: UploadingFile) {
    if (!file || !files) return;
    setAdding(false);
    onChange?.([...files, file]);
    setActiveStep(files.length);
  }

  /**
   * Update the file with the upload progress
   * @param file - The file that is being uploaded
   * @param progress - The progress of the upload
   */
  function handleUploadProgress(file: UploadingFile | undefined, progress: FileProgress) {
    if (!file || !files) return;
    const percentage = MathUtils.getPercentage(progress.bytesUploaded, progress.bytesTotal);
    onChange?.(
      files.map((existingFile) =>
        existingFile.id === file.id ? { ...file, progress: { ...file.progress!, percentage } } : existingFile,
      ),
    );
  }

  /**
   * Update the file with the upload URL and set the progress to 100%
   * @param file - The file that was uploaded
   * @param response - The response from the server
   */
  function handleUploadSuccess(file: UploadingFile | undefined, response: SuccessResponse) {
    if (!file || !files) return;
    onChange?.(
      files.map((existingFile) =>
        existingFile.id === file.id
          ? { ...file, progress: { ...file.progress!, percentage: 100 }, uploadURL: response.uploadURL }
          : existingFile,
      ),
    );
  }

  /**
   * Clear the files when an error occurs
   */
  function handleError() {
    if (!files) return;
    uppy.cancelAll();
    onChange?.([]);
    setActiveStep(0);
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
  }, [files, onChange]);

  /**
   * Select the file and add them to the uploader
   * @param acceptedFiles - The files that were selected
   */
  function handleDrop(acceptedFiles: File[]) {
    // Convert the file to the format that Uppy expects
    const newFiles = acceptedFiles.map((file) => ({
      name: file.name,
      type: file.type,
      extension: file.name.split('.').pop() || '',
      size: file.size,
      data: file,
    }));

    // Remove all the files from the uploader
    uppy.cancelAll();

    // Remove all the files from the uploads list
    onChange?.(files || []);

    // Add the files to the uploader
    try {
      uppy.addFile(newFiles[0]);
    } catch (err) {
      uppy.cancelAll();
      onChange?.([]);
      console.error(err);
    }
  }

  function handleNext() {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  function handleBack() {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  /**
   * Remove the file from the uppy instance and the uploads list
   * @param file
   * @returns
   */
  function handleDelete(file: UploadingFile | MediaEntity) {
    if (!file || !files) return;
    if (store.media.isUploadingFile(file)) uppy.removeFile(file.id);
    const newFiles = files.filter((existingFile) => existingFile.id !== file.id);
    onChange?.(newFiles);
    setActiveStep(0);
    if (isSelected) onSelect?.(newFiles[0] || null);
  }

  const borderColor = isDragActive && !isDragReject ? alpha(Color.Brown, 0.6) : 'rgba(0, 0, 0, 0.19)';

  const addFile = (
    <Button
      fullWidth
      color="inherit"
      sx={{
        p: 0.5,
        textTransform: 'none',
        color: Color.White,
        borderRadius: '10px',
        background: 'rgba(255, 255, 255, 0.09)',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.13)',
        },
      }}
      {...getRootProps()}
    >
      <Box
        sx={{
          borderRadius: '10px',
          border: `3px dashed ${borderColor}`,
          display: 'flex',
          flexDirection: 'column',
          flex: '1 0 auto',
          alignItems: 'center',
          justifyContent: 'center',
          background: isDragActive && !isDragReject ? alpha(Color.Brown, 0.05) : undefined,
          flexWrap: 'wrap',
          height: 291.5,
          width: '100%',
        }}
      >
        <input {...getInputProps()} />

        <Box sx={{ p: 4 }}>
          <CloudUpload fontSize="large" htmlColor={Color.BrownLight} sx={{ mt: -2 }} />

          <Typography variant="h5" sx={{ mt: 2 }}>
            {isDragActive && !isDragReject && 'Drop the file here'}
            {isDragReject && 'File type not accepted'}
            {!isDragActive && 'Click to select or drag and drop'}
          </Typography>

          <Typography variant="caption">
            {allowedFileTypes && `Only ${generateFileTypesString(allowedFileTypes)} files are allowed`}
          </Typography>
        </Box>
      </Box>
    </Button>
  );

  const activeFile = files?.[activeStep];
  const isSelected = selectedMediaId === activeFile?.id;

  if (!files?.length || !activeFile) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0.5, my: 1.35 }}>
          <Typography variant="h6">Media</Typography>
        </Box>

        {addFile}
      </Box>
    );
  }

  if (adding) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0.5 }}>
          <Typography variant="h6">Media</Typography>

          <IconButton onClick={() => setAdding(false)}>
            <Close />
          </IconButton>
        </Box>

        {addFile}
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0.5 }}>
        <Typography variant="h6">Media</Typography>

        <IconButton onClick={() => setAdding(!adding)}>
          <Add />
        </IconButton>
      </Box>

      <Box sx={{ background: 'rgba(255, 255, 255, 0.09)', overflow: 'hidden', borderRadius: '10px' }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '10px', p: 0.5 }}
        >
          <Typography
            variant="body2"
            sx={{
              pl: 1,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {activeFile.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PopupState variant="popover" popupId={`media-${activeFile.id}`}>
              {(popupState) => (
                <>
                  <Tooltip title="More">
                    <IconButton {...bindTrigger(popupState)}>
                      <MoreHoriz />
                    </IconButton>
                  </Tooltip>

                  <Popover
                    {...bindPopover(popupState)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  >
                    <MenuList>
                      <MenuItem
                        disabled={isSelected}
                        onClick={() => {
                          onSelect?.(activeFile);
                          popupState.close();
                        }}
                      >
                        <ListItemIcon>
                          <Done />
                        </ListItemIcon>
                        <ListItemText>Set as active</ListItemText>
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          handleDelete(activeFile);
                          popupState.close();
                        }}
                      >
                        <ListItemIcon>
                          <Delete />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                      </MenuItem>
                    </MenuList>
                  </Popover>
                </>
              )}
            </PopupState>
          </Box>
        </Box>

        <Box
          sx={{
            overflow: 'hidden',
            height: 200,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {store.media.isUploadingFile(activeFile) && (
            <>
              {store.media.isUploadedFile(activeFile) ? (
                <Box component="img" src={activeFile.uploadURL} height={200} />
              ) : (
                <Box>
                  {activeFile.progress && (
                    <CircularProgressWithLabel
                      color={activeFile.progress.percentage === 100 && activeFile.uploadURL ? 'success' : 'info'}
                      value={activeFile.progress.percentage || 0}
                    />
                  )}
                </Box>
              )}
            </>
          )}

          {store.media.isMedia(activeFile) && (
            <>{activeFile.thumbnailUrl && <Box component="img" src={activeFile.thumbnailUrl} height={200} />}</>
          )}

          <Box sx={{ position: 'absolute', top: 0, left: 8 }}>
            {isSelected && files.length > 1 && (
              <Chip size="small" label="Active" color="primary" icon={<Visibility />} />
            )}
          </Box>
        </Box>

        <MobileStepper
          steps={files.length}
          position="static"
          activeStep={activeStep}
          sx={{ background: 'transparent' }}
          nextButton={
            <Button size="small" onClick={handleNext} disabled={activeStep === files.length - 1}>
              Next
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              <KeyboardArrowLeft />
              Back
            </Button>
          }
        />
      </Box>
    </Box>
  );
}
