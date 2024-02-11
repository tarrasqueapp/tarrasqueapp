import { useEffect, useState } from 'react';

import { useGetCampaignPlugins } from '@/hooks/data/campaigns/plugins/useGetCampaignPlugins';
import { useGetCurrentMap } from '@/hooks/data/maps/useGetCurrentMap';

import { Plugin } from './Plugin';

export function Plugins() {
  const { data: map } = useGetCurrentMap();
  const { data: campaignPlugins } = useGetCampaignPlugins(map?.campaign_id || '');

  const [loadedPlugins, setLoadedPlugins] = useState<number>(0);

  useEffect(() => {
    if (campaignPlugins?.length !== loadedPlugins) return;

    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
      iframe.contentWindow?.postMessage({ event: 'TARRASQUE_READY' }, '*');
    });
  }, [loadedPlugins]);

  return (
    <>
      {campaignPlugins?.map((campaignPlugin) => (
        <Plugin
          key={campaignPlugin.plugin!.manifest_url}
          manifestUrl={campaignPlugin.plugin!.manifest_url}
          onLoad={() => setLoadedPlugins(loadedPlugins + 1)}
        />
      ))}
    </>
  );
}