import { Graphics } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { useGetGrid } from '@/hooks/data/grids/useGetGrid';
import { useUpdateGrid } from '@/hooks/data/grids/useUpdateGrid';
import { useGetCurrentMap } from '@/hooks/data/maps/useGetCurrentMap';
import { usePixiStore } from '@/store/usePixiStore';
import { Color } from '@/utils/colors';
import { HotkeysUtils } from '@/utils/helpers/hotkeys';
import { Coordinates } from '@/utils/types';

export function GridAlignment() {
  const { data: map } = useGetCurrentMap();
  const { data: grid } = useGetGrid(map?.id);
  const updateGrid = useUpdateGrid();

  const aligningGrid = usePixiStore((state) => state.aligningGrid);
  const setAligningGrid = usePixiStore((state) => state.setAligningGrid);

  const [isDrawing, setIsDrawing] = useState(false);
  const graphicsRef = useRef(new PIXI.Graphics());
  const startPoint = useRef<Coordinates>({ x: 0, y: 0 });

  useHotkeys(
    HotkeysUtils.Cancel,
    () => {
      setIsDrawing(false);
      setAligningGrid(false);
    },
    { enabled: aligningGrid },
  );

  /**
   * Initializes drawing on canvas, triggered by mouse down event
   * @param event - Mouse down event
   */
  const startDrawing = useCallback((event: PIXI.FederatedPointerEvent) => {
    if (event.button !== 0) return; // Only start drawing on left click

    const position = event.getLocalPosition(graphicsRef.current);
    startPoint.current = { x: Math.round(position.x), y: Math.round(position.y) };
    setIsDrawing(true);
  }, []);

  /**
   * Handle pointer move event to draw rectangle or hexagon on canvas
   * @param event - Mouse move event
   */
  const handlePointerMove = useCallback(
    (event: PIXI.FederatedPointerEvent) => {
      if (!isDrawing || !grid) return;

      const graphics = graphicsRef.current;
      graphics.clear();

      const lineColor = new PIXI.Color(Color.SAND_MAIN);
      graphics.lineStyle(1, lineColor);

      const fillColor = new PIXI.Color(Color.SAND_MAIN);
      graphics.beginFill(fillColor, 0.3);

      switch (grid.type) {
        case 'SQUARE': {
          drawRectangle(event);
          break;
        }
        // case 'HEX_HORIZONTAL':
        // case 'HEX_VERTICAL': {
        //   drawHexagon(event);
        //   break;
        // }
        default:
          throw new Error(`Unknown grid type: ${grid.type}`);
      }
    },
    [isDrawing],
  );

  /**
   * Draws rectangle on canvas, following the mouse pointer
   * @param event - Mouse move event
   */
  const drawRectangle = useCallback(
    (event: PIXI.FederatedPointerEvent) => {
      if (!isDrawing) return;

      const graphics = graphicsRef.current;

      const position = event.getLocalPosition(graphics);
      let width = Math.round(position.x) - startPoint.current.x;
      let height = Math.round(position.y) - startPoint.current.y;

      // Adjusts start point and dimensions for negative values
      const adjustedStartX = width < 0 ? startPoint.current.x + width : startPoint.current.x;
      const adjustedStartY = height < 0 ? startPoint.current.y + height : startPoint.current.y;
      width = Math.abs(width);
      height = Math.abs(height);

      graphics.drawRect(adjustedStartX, adjustedStartY, width, height);
      graphics.endFill();
    },
    [isDrawing],
  );

  // const drawHexagon = useCallback(
  //   (event: PIXI.FederatedPointerEvent) => {
  //     if (!isDrawing || !grid) return;

  //     const graphics = graphicsRef.current;
  //     const position = event.getLocalPosition(graphics);

  //     // Calculate the center point for the hexagon
  //     const centerX = (position.x + startPoint.current.x) / 2;
  //     const centerY = (position.y + startPoint.current.y) / 2;

  //     // Determine the radius of the hexagon
  //     const hexagonRadius =
  //       Math.max(Math.abs(position.x - startPoint.current.x), Math.abs(position.y - startPoint.current.y)) /
  //       Math.sqrt(3); // This formula adjusts the radius for the hexagon's size

  //     // Calculate the starting angle and angle increment based on grid type
  //     const startAngle = grid.type === 'HEX_HORIZONTAL' ? 0 : Math.PI / 6;
  //     const angleIncrement = Math.PI / 3; // 60 degrees for hexagon

  //     // Calculate the vertices of the hexagon
  //     const points = Array.from({ length: 6 }, (_, i) => {
  //       const angle = startAngle + angleIncrement * i;
  //       return {
  //         x: centerX + hexagonRadius * Math.cos(angle),
  //         y: centerY + hexagonRadius * Math.sin(angle),
  //       };
  //     });

  //     // Draw hexagon using the calculated points
  //     graphics.moveTo(points[0]!.x, points[0]!.y);
  //     points.forEach((point) => {
  //       graphics.lineTo(point.x, point.y);
  //     });
  //     graphics.lineTo(points[0]!.x, points[0]!.y); // Close the hexagon by connecting the last point to the first
  //     graphics.endFill();
  //   },
  //   [isDrawing],
  // );

  /**
   * Completes drawing process, triggered by mouse up event
   * @param event - Mouse up event
   */
  const stopDrawing = useCallback(
    (event: PIXI.FederatedPointerEvent) => {
      if (!isDrawing || !grid) return;

      const position = event.getLocalPosition(graphicsRef.current);
      let width: number;
      let height: number;
      let offset_x: number;
      let offset_y: number;

      switch (grid.type) {
        case 'SQUARE': {
          width = Math.round(position.x - startPoint.current.x);
          height = Math.round(position.y - startPoint.current.y);

          const adjustedStartX = width < 0 ? startPoint.current.x + width : startPoint.current.x;
          const adjustedStartY = height < 0 ? startPoint.current.y + height : startPoint.current.y;
          width = Math.abs(width);
          height = Math.abs(height);

          offset_x = adjustedStartX % width;
          offset_y = adjustedStartY % height;
          break;
        }
        // case 'HEX_HORIZONTAL': {
        //   const dx = Math.abs(position.x - startPoint.current.x);
        //   const dy = Math.abs(position.y - startPoint.current.y);
        //   const hexRadius = grid.width / Math.sqrt(3);
        //   const hexHeight = grid.height;
        //   const hexWidth = Math.sqrt(3) * hexRadius;

        //   // Approximate the hexagon size based on user drawing
        //   width = dx / hexWidth; // Number of horizontal hex widths spanned by the drawing
        //   height = dy / hexHeight; // Number of vertical hex heights spanned by the drawing

        //   offset_x = Math.max(position.x, startPoint.current.x) + Math.max(position.x, startPoint.current.x) / 2;
        //   offset_y = Math.max(position.y, startPoint.current.y) + (Math.floor(width) % 2) * (hexHeight / 2);

        //   width = Math.round(hexWidth);
        //   height = Math.round(hexHeight);

        //   // Use these values to update the grid dimensions and offsets as needed
        //   break;
        // }
        // case 'HEX_VERTICAL': {
        //   const dx = Math.abs(position.x - startPoint.current.x);
        //   const dy = Math.abs(position.y - startPoint.current.y);
        //   const hexRadius = grid.width / Math.sqrt(3);
        //   const hexHeight = 2 * hexRadius;
        //   const hexWidth = (Math.sqrt(3) / 2) * hexHeight;

        //   // Approximate the hexagon size based on user drawing
        //   width = dx / hexWidth; // Number of horizontal hex widths spanned by the drawing
        //   height = dy / (1.5 * hexRadius); // Number of vertical hex heights spanned by the drawing

        //   offset_x = Math.min(position.x, startPoint.current.x) + (Math.floor(height) % 2) * (hexWidth / 2);
        //   offset_y = Math.min(position.y, startPoint.current.y);

        //   width = hexWidth;
        //   height = hexHeight;

        //   // Use these values to update the grid dimensions and offsets as needed
        //   break;
        // }
        default:
          throw new Error(`Unknown grid type: ${grid.type}`);
      }

      setAligningGrid(false);
      setIsDrawing(false);

      if (width < 5 || height < 5) return;

      updateGrid.mutate({ id: grid.id, width, height, offset_x, offset_y });
    },
    [isDrawing],
  );

  useEffect(() => {
    if (!map?.media?.width || !map?.media?.height || !graphicsRef.current) return;

    const graphics = graphicsRef.current;
    graphics.width = map.media.width;
    graphics.height = map.media.height;
    graphics.hitArea = new PIXI.Rectangle(0, 0, map.media.width, map.media.height);
    graphics.eventMode = aligningGrid ? 'dynamic' : 'none';
    graphics.cursor = aligningGrid ? 'crosshair' : 'auto';

    if (!aligningGrid) return;

    graphics.on('pointerdown', startDrawing);
    graphics.on('pointermove', handlePointerMove);
    graphics.on('pointerup', stopDrawing);
    graphics.on('pointerupoutside', stopDrawing);

    return () => {
      if (!graphics) return;
      graphics.off('pointerdown', startDrawing);
      graphics.off('pointermove', handlePointerMove);
      graphics.off('pointerup', stopDrawing);
      graphics.off('pointerupoutside', stopDrawing);
      graphics.clear();
    };
  }, [isDrawing, map?.media, aligningGrid, graphicsRef.current]);

  return <Graphics ref={graphicsRef} />;
}
