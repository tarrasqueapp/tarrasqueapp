'use client';

import { DashboardModal, useDashboardStore } from '@/store/dashboard';

import { PluginsModal } from './top-bar/plugins/PluginsModal';

export function DashboardModals() {
  const modal = useDashboardStore((state) => state.modal);
  const setModal = useDashboardStore((state) => state.setModal);

  return (
    <>
      <PluginsModal open={modal === DashboardModal.Plugins} onClose={() => setModal(null)} />
    </>
  );
}
