'use client';

import { LibraryBooks } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { DashboardModal, useDashboardStore } from '@/store/dashboard';

export function CompendiumButton() {
  const { setModal } = useDashboardStore();

  return (
    <Tooltip title="Compendium">
      <IconButton onClick={() => setModal(DashboardModal.Compendium)}>
        <LibraryBooks />
      </IconButton>
    </Tooltip>
  );
}
