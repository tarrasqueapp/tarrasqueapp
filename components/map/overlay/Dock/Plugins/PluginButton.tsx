import { Tooltip } from '@mui/material';
import Image from 'next/image';

import { useGetPlugin } from '@/hooks/data/plugins/useGetPlugin';
import { useDraggableStore } from '@/store/useDraggableStore';

import { DockButton } from '../DockButton';

interface Props {
  manifestUrl: string;
}

export function PluginButton({ manifestUrl }: Props) {
  const { data: plugin } = useGetPlugin(manifestUrl);

  const id = `plugin_${manifestUrl}`;
  const draggable = useDraggableStore((state) => state.draggables[id]);
  const toggleVisibility = useDraggableStore((state) => state.toggleVisibility);

  /**
   * Toggle the plugin window visibility
   */
  function handleToggle() {
    toggleVisibility(id);
  }

  const iconUrl = plugin?.urls.find((url) => url.name === 'icon')?.url || '';

  if (!plugin) return null;

  return (
    <Tooltip title={plugin.name}>
      <DockButton active={draggable?.visible} onClick={handleToggle}>
        <Image src={iconUrl} alt={plugin.name} width={32} height={32} />
      </DockButton>
    </Tooltip>
  );
}
