import { useEffect, useState } from 'react';

interface IWindowSize {
  width: number;
  height: number;
  orientation?: Screen['orientation'];
}

/**
 * Get current window size
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
 * Window size hook
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState(getWindowSize());

  /**
   * Listen to resize and orientation change events
   */
  useEffect(() => {
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
