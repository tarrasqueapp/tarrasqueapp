import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Portal } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

import { useWindowSize } from '@/hooks/useWindowSize';
import { AnchorPoint, useDraggableStore } from '@/store/useDraggableStore';
import { Dimensions } from '@/utils/types';

import { DraggableContext } from './DraggableContext';

interface Props {
  id: string;
  anchorPoint?: AnchorPoint;
  initialDimensions?: Dimensions;
  children: React.ReactNode;
}

export function Draggable({ id, anchorPoint, initialDimensions, children }: Props) {
  const calculateInitialCoordinates = useDraggableStore((state) => state.calculateInitialCoordinates);
  const createDraggable = useDraggableStore((state) => state.createDraggable);
  const draggable = useDraggableStore((state) => state.draggables[id]);
  const show = useDraggableStore((state) => state.show);
  const updateCoordinates = useDraggableStore((state) => state.updateCoordinates);

  const { attributes, setNodeRef, transform } = useDraggable({ id });
  const windowSize = useWindowSize();

  const [element, setElement] = useState<HTMLElement | null>(null);
  const setRef = useCallback(
    (node: HTMLElement | null) => {
      setNodeRef(node);
      setElement(node);
    },
    [draggable?.visible],
  );

  useEffect(() => {
    if (!id || !anchorPoint || !element) return;

    // If no initial dimensions are provided, use the intrinsic dimensions of the element
    const { width, height } = element.getBoundingClientRect();
    const dimensions = initialDimensions || { width, height };

    if (!draggable) {
      // Create the draggable window
      createDraggable(id, anchorPoint, dimensions);
    } else {
      // Re-calculate the initial coordinates if the window is resized
      requestAnimationFrame(() => {
        updateCoordinates(id, calculateInitialCoordinates(anchorPoint, dimensions));
      });
    }
  }, [id, anchorPoint, initialDimensions, element, windowSize]);

  // Set the z-index of the draggable window to the next highest z-index
  useEffect(() => {
    if (!draggable?.visible) return;
    handleFocus();
  }, [draggable?.visible]);

  /**
   * Set the z-index of the draggable window to the next highest z-index
   */
  function handleFocus() {
    show(id);
  }

  return (
    <DraggableContext.Provider value={{ id }}>
      <Portal container={() => document.body}>
        <div
          ref={setRef}
          style={{
            top: draggable?.coordinates?.y || 0,
            left: draggable?.coordinates?.x || 0,
            zIndex: draggable?.zIndex || 0,
            width: draggable?.dimensions?.width || 'auto',
            height: draggable?.dimensions?.height || 'auto',
            transform: CSS.Translate.toString(transform),
            position: 'absolute',
            display: 'flex',
            visibility: draggable?.visible ? 'visible' : 'hidden',
            opacity: draggable?.visible ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out',
          }}
          {...attributes}
          onFocus={handleFocus}
        >
          {children}
        </div>
      </Portal>
    </DraggableContext.Provider>
  );
}
