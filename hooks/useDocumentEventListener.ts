import { useEffect } from 'react';

export function useDocumentEventListener<K extends keyof DocumentEventMap>(
  eventType: K,
  listener: (this: Document, ev: DocumentEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
) {
  useEffect(() => {
    document.addEventListener(eventType, listener, options);

    return () => {
      document.removeEventListener(eventType, listener, options);
    };
  }, [eventType, listener, options]);
}
