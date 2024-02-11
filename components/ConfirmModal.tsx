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
import { toast } from 'react-hot-toast';

export interface ConfirmModalProps {
  open: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

export function ConfirmModal({ open, onConfirm, onClose, title, children }: ConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  /**
   * Set the loading state and call the onConfirm function
   */
  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
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
}
