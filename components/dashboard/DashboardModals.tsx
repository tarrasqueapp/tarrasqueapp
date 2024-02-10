'use client';

import { DashboardModal, useDashboardStore } from '@/store/dashboard';

import { PluginsModal } from './TopBar/Plugins/PluginsModal';

export function DashboardModals() {
  const { modal, setModal } = useDashboardStore();

  return (
    <>
      <PluginsModal open={modal === DashboardModal.Plugins} onClose={() => setModal(null)} />
    </>
  );
}
