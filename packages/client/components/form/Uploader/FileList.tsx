import { Delete } from '@mui/icons-material';
import {
  Avatar,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';

import { store } from '../../../store';
import { FileUpload } from './Uploader';

export interface FileListProps {
  files?: FileUpload[];
  onDelete?: (file: FileUpload) => void;
  selectable?: boolean;
  selectedFileId?: string;
  onSelect?: (file: FileUpload) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onDelete, selectable, selectedFileId, onSelect }) => {
  if (!files?.length) return null;

  return (
    <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
      {files.map((file) => {
        const content = (
          <>
            <ListItemAvatar>
              <Avatar src={file.uploadURL} alt={file.name} variant="rounded" sx={{ width: 50, height: 50 }} />
            </ListItemAvatar>

            <ListItemText>
              <Typography variant="body2" sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {file.name}
              </Typography>

              <Typography variant="caption">{store.media.formatBytes(file.size!)}</Typography>

              {file.progress && (
                <LinearProgress
                  variant="determinate"
                  color={file.progress.percentage === 100 && file.uploadURL ? 'success' : 'info'}
                  value={file.progress.percentage || 0}
                />
              )}
            </ListItemText>
          </>
        );

        return selectable ? (
          <ListItem
            key={file.id}
            secondaryAction={
              <IconButton onClick={() => onDelete?.(file)}>
                <Delete />
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton
              selected={Boolean(
                file.uploadURL && selectedFileId === store.media.getFileNameFromUploadUrl(file.uploadURL),
              )}
              onClick={() => onSelect?.(file)}
              sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 2 }}
            >
              {content}
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem
            key={file.id}
            secondaryAction={
              <IconButton onClick={() => onDelete?.(file)}>
                <Delete />
              </IconButton>
            }
            // disablePadding
            sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 2 }}
          >
            {content}
          </ListItem>
        );
      })}
    </List>
  );
};
