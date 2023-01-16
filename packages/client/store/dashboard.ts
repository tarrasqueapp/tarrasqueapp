import { makeAutoObservable } from 'mobx';

class DashboardStore {
  settingsModalOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Toggle settings modal open state
   * @param open - The open state
   */
  toggleSettingsModal(open?: boolean) {
    if (open !== undefined) {
      this.settingsModalOpen = open;
    } else {
      this.settingsModalOpen = !this.settingsModalOpen;
    }
  }
}

export const dashboardStore = new DashboardStore();
