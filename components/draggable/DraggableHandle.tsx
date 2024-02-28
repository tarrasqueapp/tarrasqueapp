import { useDraggable } from '@dnd-kit/core';

import { useDraggableContext } from './DraggableContext';

interface Props {
  children: React.ReactNode;
}

export function DraggableHandle({ children }: Props) {
  const { id } = useDraggableContext();
  const { listeners, attributes } = useDraggable({ id });

  return (
    <div {...listeners} {...attributes} style={{ cursor: 'move' }}>
      {children}
    </div>
  );
}
