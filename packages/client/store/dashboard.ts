import { makeAutoObservable } from 'mobx';

class DashboardStore {
  sidebar = null as unknown as HTMLDivElement;
  sidebarOpen = false;
  settingsModalOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Set sidebar element
   * @param sidebar - The sidebar element
   */
  setSidebar(sidebar: HTMLDivElement) {
    this.sidebar = sidebar;
  }

  /**
   * Toggle sidebar open state
   * @param open - The open state
   */
  toggleSidebar(open?: boolean) {
    if (open !== undefined) {
      this.sidebarOpen = open;
    } else {
      this.sidebarOpen = !this.sidebarOpen;
    }
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
