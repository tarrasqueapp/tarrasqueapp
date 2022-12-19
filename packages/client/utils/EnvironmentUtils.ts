import { config } from '../lib/config';

export class EnvironmentUtils {
  static HostProduction = 'https://tarrasque.app';
  static HostStaging = 'https://staging.tarrasque.app';
  static HostLocal = 'http://localhost';

  /**
   * Check if the process is running on production
   */
  static isProduction() {
    return config.HOST === EnvironmentUtils.HostProduction;
  }

  /**
   * Check if the process is running on local
   */
  static isLocal() {
    return config.HOST === EnvironmentUtils.HostLocal;
  }
}
