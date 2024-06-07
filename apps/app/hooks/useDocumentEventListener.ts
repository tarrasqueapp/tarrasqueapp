import { useEffect } from 'react';

/**
 * Add a typed event listener to the document and remove it when the component is unmounted
 * @param eventType - The event type
 * @param listener - The event listener
 * @param options - The event listener options
 */
export function useDocumentEventListener<K extends keyof DocumentEventMap>(
  eventType: K,
  listener: (this: Document, ev: DocumentEventMap[K]) => unknown,
  options?: boolean | AddEventListenerOptions,
) {
  useEffect(() => {
    document.addEventListener(eventType, listener, options);

    return () => {
      document.removeEventListener(eventType, listener, options);
    };
  }, [eventType, listener, options]);
}
