import { create } from 'zustand';

interface DashboardStore {
  settingsModalOpen: boolean;
  toggleSettingsModal: (open?: boolean) => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  settingsModalOpen: false,

  /**
   * Toggle settings modal open state
   * @param open - The open state
   */
  toggleSettingsModal: (open) =>
    set(() => ({ settingsModalOpen: open !== undefined ? open : !get().settingsModalOpen })),
}));
