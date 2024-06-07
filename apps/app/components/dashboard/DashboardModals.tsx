'use client';

import { DashboardModal, useDashboardStore } from '@/store/useDashboardStore';

import { PluginsModal } from './top-bar/plugins/PluginsModal';

export function DashboardModals() {
  const modal = useDashboardStore((state) => state.modal);
  const setModal = useDashboardStore((state) => state.setModal);

  return <>{modal === DashboardModal.Plugins && <PluginsModal open onClose={() => setModal(null)} />}</>;
}
