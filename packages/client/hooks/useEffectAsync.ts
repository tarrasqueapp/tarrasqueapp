import { useEffect } from 'react';

export function useEffectAsync<T>(callback: () => Promise<T>, deps: any[] = []) {
  useEffect(() => {
    callback();
  }, deps);
}
