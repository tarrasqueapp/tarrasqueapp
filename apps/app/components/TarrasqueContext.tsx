'use client';

import { TarrasqueSDK } from '@tarrasque/sdk';
import { createContext, useContext, useEffect, useState } from 'react';

interface TarrasqueContextType {
  tarrasque: TarrasqueSDK;
}

const TarrasqueContext = createContext<TarrasqueContextType | undefined>(undefined);

export function useTarrasque() {
  const context = useContext(TarrasqueContext);
  if (!context) {
    throw new Error('useTarrasque must be used within a TarrasqueProvider');
  }
  return context;
}

export function TarrasqueProvider({ children }: { children: React.ReactNode }) {
  const [tarrasque] = useState(new TarrasqueSDK({ mode: 'app' }));

  useEffect(() => {
    return () => {
      tarrasque.destroy();
    };
  }, []);

  return <TarrasqueContext.Provider value={{ tarrasque }}>{children}</TarrasqueContext.Provider>;
}
