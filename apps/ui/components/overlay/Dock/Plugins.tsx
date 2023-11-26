import { useEffect, useState } from 'react';

import { Plugin } from './Plugin';

export function Plugins() {
  const [loadedPlugins, setLoadedPlugins] = useState<number>(0);

  const plugins = [{ manifestUrl: 'http://localhost:5173/manifest.json' }];

  useEffect(() => {
    if (plugins.length !== loadedPlugins) return;

    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
      iframe.contentWindow?.postMessage({ event: 'TARRASQUE_READY' }, '*');
    });
  }, [loadedPlugins]);

  return (
    <>
      {plugins.map((plugin) => (
        <Plugin
          key={plugin.manifestUrl}
          manifestUrl={plugin.manifestUrl}
          onLoad={() => setLoadedPlugins(loadedPlugins + 1)}
        />
      ))}
    </>
  );
}
