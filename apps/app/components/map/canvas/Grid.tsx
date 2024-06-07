import { Container } from '@pixi/react';
import { logger } from '@tarrasque/common';
import * as PIXI from 'pixi.js';
import { useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { useGetGrid } from '@/hooks/data/grids/useGetGrid';
import { useUpdateGrid } from '@/hooks/data/grids/useUpdateGrid';
import { useGetCurrentMap } from '@/hooks/data/maps/useGetCurrentMap';
import { HotkeysUtils } from '@/utils/helpers/hotkeys';

export function Grid() {
  const { data: map } = useGetCurrentMap();
  const { data: grid } = useGetGrid(map?.id);
  const updateGrid = useUpdateGrid();

  // Container for batch drawing
  const containerRef = useRef(new PIXI.Container());
  const graphicsRef = useRef(new PIXI.Graphics());

  // Register hotkey
  useHotkeys(
    HotkeysUtils.Grid,
    () => {
      if (!grid) return;
      updateGrid.mutate({ id: grid.id, visible: !grid.visible });
    },
    [grid],
  );

  useEffect(() => {
    if (!map?.media?.width || !map?.media?.height || !grid) return;

    const graphics = graphicsRef.current;
    graphics.clear();

    if (grid.visible) {
      logger.debug(`Drawing ${grid.type} grid`);

      const convertedColor = new PIXI.Color(grid.color);
      graphics.lineStyle(1, convertedColor);

      // Add extra rows and columns to cover the entire canvas
      const extraRowsColumns = 50;

      switch (grid.type) {
        case 'SQUARE': {
          // Determine the number of squares that fit horizontally and vertically
          const columns = Math.ceil(map.media.width / grid.width) + extraRowsColumns;
          const rows = Math.ceil(map.media.height / grid.height) + extraRowsColumns;

          // Draw the grid
          for (let row = -extraRowsColumns; row < rows; row++) {
            for (let col = -extraRowsColumns; col < columns; col++) {
              graphics.drawRect(
                col * grid.width + grid.offset_x,
                row * grid.height + grid.offset_y,
                grid.width,
                grid.height,
              );
            }
          }
          break;
        }
        case 'HEX_HORIZONTAL': {
          const hexRadius = grid.width / Math.sqrt(3);
          const columns = Math.ceil(map.media.width / (1.5 * hexRadius)) + extraRowsColumns;
          const rows = Math.ceil(map.media.height / grid.height) + extraRowsColumns;

          for (let row = -extraRowsColumns; row < rows; row++) {
            for (let col = -extraRowsColumns; col < columns; col++) {
              // Calculate the position of each hexagon, applying the offset to stagger rows
              const x = grid.offset_x + col * (hexRadius * 1.5);
              const y = grid.offset_y + row * grid.height + (col % 2) * (grid.height / 2);

              graphics.drawPolygon([
                x + Math.cos(0) * hexRadius,
                y + Math.sin(0) * hexRadius,
                x + Math.cos(Math.PI / 3) * hexRadius,
                y + Math.sin(Math.PI / 3) * hexRadius,
                x + Math.cos((2 * Math.PI) / 3) * hexRadius,
                y + Math.sin((2 * Math.PI) / 3) * hexRadius,
                x + Math.cos(Math.PI) * hexRadius,
                y + Math.sin(Math.PI) * hexRadius,
                x + Math.cos((4 * Math.PI) / 3) * hexRadius,
                y + Math.sin((4 * Math.PI) / 3) * hexRadius,
                x + Math.cos((5 * Math.PI) / 3) * hexRadius,
                y + Math.sin((5 * Math.PI) / 3) * hexRadius,
              ]);
            }
          }
          break;
        }
        case 'HEX_VERTICAL': {
          const hexRadius = grid.width / Math.sqrt(3);
          const hexHeight = 2 * hexRadius;
          const hexWidth = (Math.sqrt(3) / 2) * hexHeight;
          const columns = Math.ceil(map.media.width / hexWidth) + extraRowsColumns;
          const rows = Math.ceil(map.media.height / (1.5 * hexRadius)) + extraRowsColumns;

          for (let col = -extraRowsColumns; col < columns; col++) {
            for (let row = -extraRowsColumns; row < rows; row++) {
              // Calculate the position of each hexagon, applying the offset to stagger columns
              const x = grid.offset_x + col * hexWidth + (row % 2) * (hexWidth / 2);
              const y = grid.offset_y + row * (hexRadius * 1.5);

              graphics.drawPolygon([
                x + Math.cos(Math.PI / 6) * hexRadius,
                y + Math.sin(Math.PI / 6) * hexRadius,
                x + Math.cos(Math.PI / 2) * hexRadius,
                y + Math.sin(Math.PI / 2) * hexRadius,
                x + Math.cos((5 * Math.PI) / 6) * hexRadius,
                y + Math.sin((5 * Math.PI) / 6) * hexRadius,
                x + Math.cos((7 * Math.PI) / 6) * hexRadius,
                y + Math.sin((7 * Math.PI) / 6) * hexRadius,
                x + Math.cos((3 * Math.PI) / 2) * hexRadius,
                y + Math.sin((3 * Math.PI) / 2) * hexRadius,
                x + Math.cos((11 * Math.PI) / 6) * hexRadius,
                y + Math.sin((11 * Math.PI) / 6) * hexRadius,
              ]);
            }
          }

          break;
        }
        default: {
          throw new Error(`Unknown grid type: ${grid.type}`);
        }
      }
    }

    // Add the graphics to the container for batch drawing
    const container = containerRef.current;
    if (!container.children.includes(graphics)) {
      container.addChild(graphics);
    }
  }, [grid, map]);

  return <Container ref={containerRef} />;
}
