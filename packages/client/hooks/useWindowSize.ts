import { useEffect, useState } from 'react';

interface IWindowSize {
  width: number;
  height: number;
  orientation?: Screen['orientation'];
}

/**
 * Get the window size and orientation
 * @returns The window size and orientation
 */
function getWindowSize() {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }

  const size: IWindowSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  if ('orientation' in screen) {
    size.orientation = screen.orientation;
  }

  return size;
}

/**
 * Listen to window resize and orientation change events and return the window size and orientation
 * @returns The window size and orientation
 * @example
 * ```
 * const { width, height, orientation } = useWindowSize();
 * ```
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState(getWindowSize());

  /**
   * Listen to resize and orientation change events
   */
  useEffect(() => {
    /**
     * Handle resize and orientation change events
     */
    function handleResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return windowSize;
}
