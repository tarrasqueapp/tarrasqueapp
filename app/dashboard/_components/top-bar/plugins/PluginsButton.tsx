'use client';

import { Extension } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { DashboardModal, useDashboardStore } from '@/store/dashboard';

export function PluginsButton() {
  const setModal = useDashboardStore((state) => state.setModal);

  return (
    <Tooltip title="Plugins">
      <IconButton onClick={() => setModal(DashboardModal.Plugins)}>
        <Extension />
      </IconButton>
    </Tooltip>
  );
}
