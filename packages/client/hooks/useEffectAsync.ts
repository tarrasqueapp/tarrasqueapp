import { useEffect } from 'react';

/**
 * Use an async function as a useEffect callback
 * @param callback - The async function to use as a callback
 * @param deps - The dependencies to watch for changes
 * @returns The async function
 * @example
 * ```
 * useEffectAsync(async () => {
 *  await doSomething();
 * }, [doSomething]);
 * ```
 */
export function useEffectAsync<T>(callback: () => Promise<T>, deps: any[] = []) {
  useEffect(() => {
    callback();
  }, deps);
}
