import { Alert, Box, CircularProgress, alpha } from '@mui/material';
import { toast } from 'react-hot-toast';

import { deleteMap } from '@/actions/maps';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useGetMap } from '@/hooks/data/maps/useGetMap';
import { Color } from '@/lib/colors';

interface DeleteMapModalProps {
  open: boolean;
  onClose: () => void;
  mapId: string;
}

export function DeleteMapModal({ open, onClose, mapId }: DeleteMapModalProps) {
  const { data: map } = useGetMap(mapId);

  /**
   * Handle deleting a map
   */
  async function handleDeleteSelectedMap() {
    if (!mapId) return;

    const response = await deleteMap({ id: mapId });

    if (response?.error) {
      toast.error(response.error);
      return;
    }
  }

  return (
    <ConfirmModal title="Delete Map" open={open} onConfirm={handleDeleteSelectedMap} onClose={onClose}>
      {map ? (
        <>
          <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
            This action cannot be undone.
          </Alert>
          You&apos;re about to delete the map &quot;<strong>{map.name}</strong>&quot; and all of its associated data.
        </>
      ) : (
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
    </ConfirmModal>
  );
}
