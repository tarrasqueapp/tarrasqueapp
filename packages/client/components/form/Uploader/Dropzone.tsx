import { CloudUpload } from '@mui/icons-material';
import { Box, Button, Typography, alpha } from '@mui/material';
import React from 'react';
import { useDropzone } from 'react-dropzone';

import { Color } from '../../../lib/colors';

export interface DropzoneProps {
  onSelect: (files: File[]) => void;
  allowedFileTypes?: string[] | null;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onSelect, allowedFileTypes }) => {
  // Setup the dropzone
  const accept: Record<string, string[]> = {};
  allowedFileTypes?.forEach((allowedFileType) => (accept[allowedFileType] = []));
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept,
    multiple: false,
    onDropAccepted: onSelect,
  });

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
            flexWrap: 'wrap',
            minHeight: 160,
            width: '100%',
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />

          <Box sx={{ p: 4 }}>
            <CloudUpload fontSize="large" htmlColor={Color.BrownLight} sx={{ mt: -2 }} />

            <Typography variant="h4" sx={{ mt: 2 }}>
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
    </Box>
  );
};
