'use client';

import { DashboardModal, useDashboardStore } from '@/store/dashboard';

import { PluginsModal } from './top-bar/plugins/PluginsModal';

export function DashboardModals() {
  const { modal, setModal } = useDashboardStore();

  return (
    <>
      <PluginsModal open={modal === DashboardModal.Plugins} onClose={() => setModal(null)} />
    </>
  );
}
