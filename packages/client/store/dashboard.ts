import { makeAutoObservable } from 'mobx';

class DashboardStore {
  sidebar = null as unknown as HTMLDivElement;
  sidebarOpen = false;

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
}

export const dashboardStore = new DashboardStore();
