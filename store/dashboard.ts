import { create } from 'zustand';

export enum DashboardModal {
  Plugins = 'plugins',
  Compendium = 'compendium',
  Settings = 'settings',
}

interface DashboardStore {
  modal: DashboardModal | null;
  setModal: (modal: DashboardModal | null) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  modal: null,

  /**
   * Set the modal to open
   * @param modal - The modal to open
   */
  setModal: (modal) => set(() => ({ modal })),
}));
