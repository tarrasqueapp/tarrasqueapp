import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React, { useState } from 'react';

export interface IConfirmModalProps {
  open: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

export const ConfirmModal: React.FC<IConfirmModalProps> = ({ open, onConfirm, onClose, title, children }) => {
  const [loading, setLoading] = useState(false);

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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title || 'Are you sure?'}</DialogTitle>

      <DialogContent>
        <DialogContentText>{children || 'This can NOT be undone.'}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <LoadingButton loading={loading} onClick={handleConfirm} variant="contained">
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
