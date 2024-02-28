import { useGetPlugin } from '@/hooks/data/plugins/useGetPlugin';

import { PluginButton } from './PluginButton';
import { PluginWindow } from './PluginWindow';

interface Props {
  manifestUrl: string;
  onLoad: () => void;
}

export function Plugin({ manifestUrl, onLoad }: Props) {
  const { data: plugin } = useGetPlugin(manifestUrl);

  if (!plugin) return null;

  return (
    <>
      <PluginButton manifestUrl={manifestUrl} />
      <PluginWindow manifestUrl={manifestUrl} onLoad={onLoad} />
    </>
  );
}
