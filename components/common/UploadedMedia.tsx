import { Delete } from '@mui/icons-material';
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';

import { MediaEntity } from '../../lib/types';
import { store } from '../../store';

interface UploadedMediaProps {
  media?: MediaEntity[];
  selectedMediaId?: string;
  onSelect?: (media: MediaEntity) => void;
  onDelete?: (media: MediaEntity) => void;
}

export function UploadedMedia({ media, selectedMediaId, onSelect, onDelete }: UploadedMediaProps) {
  if (!media?.length) return null;

  return (
    <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {media.map((item) => (
        <ListItem
          key={item.id}
          secondaryAction={
            <IconButton onClick={() => onDelete?.(item)}>
              <Delete />
            </IconButton>
          }
          disablePadding
        >
          <ListItemButton
            selected={selectedMediaId === item.id}
            onClick={() => onSelect?.(item)}
            sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 2 }}
          >
            <ListItemAvatar>
              <Avatar src={item.thumbnail_url} alt={item.name} variant="rounded" sx={{ width: 50, height: 50 }} />
            </ListItemAvatar>

            <ListItemText>
              <Typography variant="body2" sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {item.name}
              </Typography>

              <Typography variant="caption">{store.media.formatBytes(item.size!)}</Typography>
            </ListItemText>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
