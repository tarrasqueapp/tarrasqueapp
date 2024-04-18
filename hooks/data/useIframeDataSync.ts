import { useQueryClient } from '@tanstack/react-query';

import { Campaign } from '@/actions/campaigns';
import { Map as MapEntity } from '@/actions/maps';
import { useTarrasque } from '@/components/TarrasqueContext';
import { usePixiStore } from '@/store/usePixiStore';
import { Coordinates } from '@/utils/types';

import { useEffectAsync } from '../useEffectAsync';

export function useIframeDataSync() {
  const queryClient = useQueryClient();

  const { tarrasque } = useTarrasque();
  const mapId = usePixiStore((state) => state.mapId);

  /**
   * Listen for a message from child windows and respond
   * @param callback - The callback to run when a message is received
   */
  function setupMessageHandler(
    callback: (message: { event: string; data?: unknown }) => ((data?: unknown) => unknown) | undefined,
  ): () => void {
    // Listen for messages from child windows
    const handleMessage = (event: MessageEvent) => {
      const message = event.data as { event: string; data?: unknown };
      if (!message.event) return;

      // Run the callback to get the event handler
      const eventHandler = callback?.(message);
      if (!eventHandler) return;

      // Send the response back to the child window, with the resolved event handler
      const response = { event: message.event, data: eventHandler(message.data) };
      event.source?.postMessage(response, { targetOrigin: event.origin });
    };

    // Register the listener
    window.addEventListener('message', handleMessage);

    // Return a function to unregister the listener
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }

  /**
   * Compare two arrays to see if they are equal
   * @param a - The first array
   * @param b - The second array
   * @returns Whether the arrays are equal
   */
  function compareArrays(a: unknown[], b: unknown[]) {
    return a.length === b.length && a.every((element, index) => element === b[index]);
  }

  // Register listeners for messages from child windows
  useEffectAsync(async () => {
    if (!queryClient) return;

    /**
     * Register a listener for messages from child windows to respond to with data
     * @returns A function to unregister the listener
     */
    const unsubscribeFromWindowMessage = setupMessageHandler((message) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const eventHandlers: Record<string, (data?: any) => void> = {
        // Get the current campaign from the cache
        campaign: () => {
          const map = queryClient.getQueryData<MapEntity>(['maps', mapId]);
          return map?.campaign_id;
        },
        // Get the current map from the cache
        map: () => queryClient.getQueryData<Campaign>(['maps', mapId]),
        'ping-location': (coordinates: Coordinates) => {
          // Emit the ping location event
          tarrasque.emit('ping-location', {
            coordinates,
            color: 'red',
            mapId,
            userId: '',
          });
        },
      };
      return eventHandlers[message.event];
    });

    /**
     * Register a listener for changes to the query cache to broadcast to child windows
     * @returns A function to unregister the listener
     */
    const unsubscribeFromQueryCache = queryClient.getQueryCache().subscribe((event) => {
      if (!event.query?.queryKey || (event.type !== 'added' && event.type !== 'updated')) return;

      // Get the current map from the cache
      const map = queryClient.getQueryData<MapEntity>(['maps', mapId]);
      if (!map) return;

      // Create a map of query keys to event handlers
      const eventHandlers = new Map();
      eventHandlers.set(['campaigns', map.campaign_id], () =>
        tarrasque.emit('campaign-changed', event.query.state.data),
      );
      eventHandlers.set(['maps', map.id], () => tarrasque.emit('map-changed', event.query.state.data));

      // Loop through all the event handlers and call them if the query key matches
      for (const [queryKey, handler] of eventHandlers.entries()) {
        if (compareArrays(queryKey, event.query.queryKey)) {
          handler();
        }
      }
    });

    // Unsubscribe from the listeners when the component unmounts
    return () => {
      unsubscribeFromWindowMessage();
      unsubscribeFromQueryCache();
    };
  }, [queryClient]);
}
