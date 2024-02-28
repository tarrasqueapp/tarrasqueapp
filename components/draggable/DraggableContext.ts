import { createContext, useContext } from 'react';

interface DraggableContextType {
  id: string;
}

export const DraggableContext = createContext<DraggableContextType | undefined>(undefined);

export function useDraggableContext() {
  const context = useContext(DraggableContext);
  if (!context) {
    throw new Error('useDraggableContext must be used within a DraggableProvider');
  }
  return context;
}
