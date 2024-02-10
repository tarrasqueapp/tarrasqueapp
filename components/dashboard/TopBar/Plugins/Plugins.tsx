'use client';

import { Extension } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { DashboardModal, useDashboardStore } from '@/store/dashboard';

export function Plugins() {
  const { setModal } = useDashboardStore();

  return (
    <Tooltip title="Plugins">
      <IconButton onClick={() => setModal(DashboardModal.Plugins)}>
        <Extension />
      </IconButton>
    </Tooltip>
  );
}
