import { DndContext, DragEndEvent, useSensor, useSensors } from '@dnd-kit/core';
import { Box, Stack } from '@mui/material';

import { CustomPointerSensor } from '@/components/draggable/CustomPointerSensor';
import { useDraggableStore } from '@/store/draggable';

import { Dock } from './Dock/Dock';
import { GridSettings } from './GridSettings';
import { MapContextMenu } from './MapContextMenu';
import { Toolbar } from './Toolbar/Toolbar';
import { ZoomControls } from './ZoomControls';

export function Overlay() {
  const sensors = useSensors(useSensor(CustomPointerSensor));
  const updateCoordinates = useDraggableStore((state) => state.updateCoordinates);

  /**
   * Update the active coordinates of the draggable window on drag end based on the delta
   * @param event - The drag end event
   */
  function handleDragEnd(event: DragEndEvent) {
    const id = event.active.id as string;
    const draggable = useDraggableStore.getState().draggables[id];
    if (!draggable) return;

    // Get the initial coordinates of the draggable window as set on drag start
    const initialCoordinates = draggable.coordinates;
    const delta = { x: event.delta.x, y: event.delta.y };

    // Calculate new coordinates based on the initial position plus the delta
    const newCoordinates = { x: initialCoordinates.x + delta.x, y: initialCoordinates.y + delta.y };
    updateCoordinates(id, newCoordinates);
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <Box sx={{ position: 'fixed', top: 0, left: 0 }}>
        <MapContextMenu />
        <Toolbar />

        <Stack sx={{ position: 'fixed', top: 8, right: 8 }}>
          <ZoomControls />
          <GridSettings />
        </Stack>

        <Dock />
      </Box>
    </DndContext>
  );
}
