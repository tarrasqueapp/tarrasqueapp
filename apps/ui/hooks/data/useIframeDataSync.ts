import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { CampaignEntity, MapEntity, UserEntity } from '@tarrasque/common';

const compareArrays = (a: unknown[], b: unknown[]) =>
  a.length === b.length && a.every((element, index) => element === b[index]);

export function useIframeDataSync() {
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (!queryClient) return;

    window.addEventListener('message', handleMessageEvent);

    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (!event.query?.queryKey || (event.type !== 'added' && event.type !== 'updated')) return;

      // Get the current map from the cache
      const map = queryClient.getQueryData<MapEntity>(['maps', router.query.mapId]);

      if (!map) return;

      const eventHandlers = new Map();

      eventHandlers.set(['campaigns', map.campaignId], () => {
        postMessage<CampaignEntity>('TARRASQUE_CAMPAIGN_CHANGED', event.query.state.data);
      });

      eventHandlers.set(['maps', map.id], () => {
        postMessage<MapEntity>('TARRASQUE_MAP_CHANGED', event.query.state.data);
      });

      // Loop through all the event handlers and call them if the query key matches
      for (const [queryKey, handler] of eventHandlers.entries()) {
        if (compareArrays(queryKey, event.query.queryKey)) {
          handler();
        }
      }
    });

    return () => {
      window.removeEventListener('message', handleMessageEvent);

      unsubscribe();
    };
  }, [queryClient, router.isReady]);

  /**
   * Handle a message event from an iframe
   * @param event - The message event
   */
  function handleMessageEvent(event: MessageEvent) {
    const message = event.data;

    const eventHandlers: Record<string, () => void> = {
      TARRASQUE_CAMPAIGN_GET: () => {
        const map = queryClient.getQueryData<MapEntity>(['maps', router.query.mapId]);
        return map?.campaign;
      },
      TARRASQUE_MAP_GET: () => queryClient.getQueryData<CampaignEntity>(['maps', router.query.mapId]),
      TARRASQUE_USER_GET: () => queryClient.getQueryData<UserEntity>(['user']),
    };

    if (eventHandlers[message.event]) {
      event.source?.postMessage(
        { event: message.event, data: eventHandlers[message.event]() },
        { targetOrigin: event.origin },
      );
      return;
    }

    throw new Error(`Unknown event: ${message.event}`);
  }

  function postMessage<T>(event: string, data?: T) {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
      iframe.contentWindow?.postMessage({ event, data }, '*');
    });
  }
}
