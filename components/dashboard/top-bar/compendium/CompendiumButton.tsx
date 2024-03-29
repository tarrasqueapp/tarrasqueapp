'use client';

import { LibraryBooks } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { DashboardModal, useDashboardStore } from '@/store/useDashboardStore';

export function CompendiumButton() {
  const setModal = useDashboardStore((state) => state.setModal);

  return (
    <Tooltip title="Compendium">
      <IconButton onClick={() => setModal(DashboardModal.Compendium)}>
        <LibraryBooks />
      </IconButton>
    </Tooltip>
  );
}
