import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { SocketEvent } from '../../lib/events';
import { socket } from '../../lib/socket';
import { CampaignEntity, MapEntity, PositionEntity } from '../../lib/types';
import { useEffectAsync } from '../useEffectAsync';

export function useIframeDataSync() {
  const queryClient = useQueryClient();

  const params = useParams();

  /**
   * Post a message to child windows
   * @param event - The event to send
   * @param data - The payload to send with the event
   */
  function broadcast(event: string, data?: unknown) {
    // Get all iframes on the page
    const iframes = document.querySelectorAll('iframe');

    iframes.forEach((iframe) => {
      // Send the message to the child window
      iframe.contentWindow?.postMessage({ event: `${event}`, data }, '*');
    });
  }

  /**
   * Listen for a message from child windows and respond
   * @param callback - The callback to run when a message is received
   */
  function setupMessageHandler(
    callback: (message: { event: string; data?: unknown }) => (data?: unknown) => unknown,
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
      const eventHandlers: Record<string, (data?: any) => void> = {
        // Get the current campaign from the cache
        TARRASQUE_CAMPAIGN: () => {
          const map = queryClient.getQueryData<MapEntity>(['maps', params?.mapId]);
          return map?.campaign;
        },
        // Get the current map from the cache
        TARRASQUE_MAP: () => queryClient.getQueryData<CampaignEntity>(['maps', params?.mapId]),
        TARRASQUE_PING_LOCATION: (position: PositionEntity) => {
          // Emit the ping location event
          socket.emit(SocketEvent.PING_LOCATION, {
            position,
            color: 'red',
            mapId: params?.mapId as string,
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
      const map = queryClient.getQueryData<MapEntity>(['maps', params?.mapId]);
      if (!map) return;

      // Create a map of query keys to event handlers
      const eventHandlers = new Map();
      eventHandlers.set(['campaigns', map.campaignId], () => broadcast('CAMPAIGN_CHANGED', event.query.state.data));
      eventHandlers.set(['maps', map.id], () => broadcast('MAP_CHANGED', event.query.state.data));

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
