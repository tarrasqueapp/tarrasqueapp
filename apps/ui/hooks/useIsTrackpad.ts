import { useEffect, useRef, useState } from 'react';

export function useIsTrackpad(): boolean {
  const [isTouchPad, setIsTouchPad] = useState<boolean>(false);
  const eventCountRef = useRef<number>(0);
  const eventCountStartRef = useRef<number | null>(null);
  const touchPadDetectedRef = useRef<boolean>(false);

  useEffect(() => {
    /**
     * Handle mouse events to detect if the device is a trackpad
     */
    function handleMouse(): void {
      if (!touchPadDetectedRef.current) {
        if (eventCountRef.current === 0) {
          eventCountStartRef.current = new Date().getTime();
        }

        eventCountRef.current++;

        if (new Date().getTime() - (eventCountStartRef.current || 0) > 50) {
          touchPadDetectedRef.current = eventCountRef.current > 5;
          setIsTouchPad(touchPadDetectedRef.current);
        }
      }
    }

    /**
     * Disable pinch-to-zoom gestures on non-canvas elements
     * @param event - The wheel event
     */
    function handleWheel(event: WheelEvent): void {
      if (!(event.target instanceof HTMLCanvasElement)) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        handleMouse();
      }
    }

    document.addEventListener('mousewheel', handleMouse, false);
    document.addEventListener('DOMMouseScroll', handleMouse, false);
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('mousewheel', handleMouse, false);
      document.removeEventListener('DOMMouseScroll', handleMouse, false);
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return isTouchPad;
}
