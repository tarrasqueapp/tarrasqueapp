import { Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Theme,
  useMediaQuery,
} from '@mui/material';
import React, { useState } from 'react';

export interface ConfirmModalProps {
  open: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ open, onConfirm, onClose, title, children }) => {
  const [loading, setLoading] = useState(false);
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  /**
   * Set the loading state and call the onConfirm function
   */
  async function handleConfirm() {
    setLoading(true);
    await onConfirm();
    onClose();
    setLoading(false);
  }

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={onClose}>
      <DialogTitle>
        <span>{title || 'Are you sure?'}</span>

        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>{children || 'This cannot be undone.'}</DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <LoadingButton loading={loading} onClick={handleConfirm} variant="contained">
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
