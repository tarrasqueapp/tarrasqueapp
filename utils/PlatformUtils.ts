enum Platform {
  macOS = 'darwin',
  Windows = 'win32',
  Linux = 'linux',
  iOS = 'iOS',
  Android = 'android',
  Unknown = 'unknown',
}

enum Browser {
  Chrome = 'Chrome',
  Safari = 'Safari',
  Firefox = 'Firefox',
  IE = 'IE',
  Edge = 'Edge',
  Other = 'Other',
}

export class PlatformUtils {
  /**
   * Get the platform's operating system
   */
  static getOperatingSystem() {
    if (typeof window === 'undefined' || !window || !window.navigator) return Platform.Unknown;
    if (PlatformUtils.checkPlatform(/iPhone|iPad|iPod/)) return Platform.iOS;
    if (PlatformUtils.checkUserAgent(/Android/)) return Platform.Android;
    if (PlatformUtils.checkPlatform(/Mac/)) return Platform.macOS;
    if (PlatformUtils.checkPlatform(/Win/)) return Platform.Windows;
    if (PlatformUtils.checkPlatform(/Linux/)) return Platform.Linux;
    return Platform.Unknown;
  }

  /**
   * Get the browser name
   */
  static getBrowser() {
    if (typeof window === 'undefined') return;

    const { userAgent } = window.navigator;
    let browser: Browser = Browser.Other;

    if (!userAgent) {
      return browser;
    }

    const doc = document as Document & { documentMode: boolean };
    const win = window as Window & typeof globalThis & { StyleMedia: string };
    const isIE = false || !!doc.documentMode;
    const isEdge = !isIE && !!win.StyleMedia;

    if (userAgent.indexOf('Chrome') !== -1 && !isEdge) {
      browser = Browser.Chrome;
    } else if (userAgent.indexOf('Safari') !== -1 && !isEdge) {
      browser = Browser.Safari;
    } else if (userAgent.indexOf('Firefox') !== -1) {
      browser = Browser.Firefox;
    } else if (userAgent.indexOf('MSIE') !== -1 || !!doc.documentMode === true) {
      browser = Browser.IE;
    } else if (isEdge) {
      browser = Browser.Edge;
    }

    return browser;
  }

  /**
   * Check if the current platform is an Apple device
   */
  static isApple() {
    const operatingSystem = PlatformUtils.getOperatingSystem();
    return operatingSystem === Platform.iOS || operatingSystem === Platform.macOS;
  }

  /**
   * Whether the device is touch-enabled or not
   */
  static isTouch() {
    if (typeof window === 'undefined') return false;

    return (
      'ontouchstart' in window ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).DocumentTouch && document instanceof (window as any).DocumentTouch) ||
      navigator.maxTouchPoints > 0
    );
  }

  /**
   * Whether the platform matches an expression
   * @param reg - The expression to match
   */
  static checkPlatform(reg: RegExp) {
    return window.navigator.platform && reg.test(window.navigator.platform);
  }

  /**
   * Whether the browser matches an expression
   * @param reg - The expression to match
   */
  static checkUserAgent(reg: RegExp) {
    return window.navigator.userAgent && reg.test(window.navigator.userAgent);
  }
}
