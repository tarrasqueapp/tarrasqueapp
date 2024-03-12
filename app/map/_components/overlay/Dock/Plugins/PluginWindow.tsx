import { Close } from '@mui/icons-material';
import { Box, Divider, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';

import { Draggable } from '@/components/draggable/Draggable';
import { DraggableHandle } from '@/components/draggable/DraggableHandle';
import { useGetPlugin } from '@/hooks/data/plugins/useGetPlugin';
import { AnchorPoint, useDraggableStore } from '@/store/draggable';

interface Props {
  manifestUrl: string;
  onLoad: () => void;
}

export function PluginWindow({ manifestUrl, onLoad }: Props) {
  const { data: plugin } = useGetPlugin(manifestUrl);

  const id = `plugin_${manifestUrl}`;
  const toggleVisibility = useDraggableStore((state) => state.toggleVisibility);

  /**
   * Toggle the dice roller window visibility
   */
  function handleToggleDraggable() {
    toggleVisibility(id);
  }

  const iconUrl = plugin?.urls.find((url) => url.name === 'icon')?.url || '';
  const mapIframeUrl = plugin?.urls.find((url) => url.name === 'map_iframe')?.url || '';
  const mapIframeWidth = plugin?.urls.find((url) => url.name === 'map_iframe')?.width;
  const mapIframeHeight = plugin?.urls.find((url) => url.name === 'map_iframe')?.height;

  if (!plugin) return null;

  return (
    <Draggable id={id} anchorPoint={AnchorPoint.BOTTOM_LEFT}>
      <Paper sx={{ lineHeight: 0, overflow: 'hidden' }}>
        <DraggableHandle>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            }}
          >
            <Stack direction="row" alignItems="center" sx={{ flexGrow: 1, pl: 1, gap: 1 }}>
              <Image src={iconUrl} alt={plugin.name} width={16} height={16} />
              <Typography variant="overline">{plugin.name}</Typography>
            </Stack>

            <Tooltip title="Close" placement="top">
              <IconButton onClick={handleToggleDraggable} sx={{ ml: 1 }}>
                <Close fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          <Divider />
        </DraggableHandle>

        <Box
          component="iframe"
          title={plugin.name}
          src={mapIframeUrl}
          onLoad={onLoad}
          sx={{ border: 'none', width: mapIframeWidth, height: mapIframeHeight }}
        />
      </Paper>
    </Draggable>
  );
}
