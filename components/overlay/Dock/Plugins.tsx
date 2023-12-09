import { useEffect, useState } from 'react';

import { useGetCampaignPlugins } from '@/hooks/data/campaigns/plugins/useGetCampaignPlugins';
import { useGetCurrentMap } from '@/hooks/data/maps/useGetCurrentMap';

import { Plugin } from './Plugin';

export function Plugins() {
  const { data: map } = useGetCurrentMap();
  const { data: plugins } = useGetCampaignPlugins(map?.campaign_id || '');

  const [loadedPlugins, setLoadedPlugins] = useState<number>(0);

  useEffect(() => {
    if (plugins?.length !== loadedPlugins) return;

    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
      iframe.contentWindow?.postMessage({ event: 'TARRASQUE_READY' }, '*');
    });
  }, [loadedPlugins]);

  return (
    <>
      {plugins?.map((plugin) => (
        <Plugin
          key={plugin.manifest_url}
          manifestUrl={plugin.manifest_url}
          onLoad={() => setLoadedPlugins(loadedPlugins + 1)}
        />
      ))}
    </>
  );
}
