import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * A hook that provides a way to update a state optimistically
 * TODO: Remove this hook once `useOptimistic` from `react` is fixed and no longer flashes the old state
 * @param passthrough - The value to be used as the initial state
 * @param reducer - The function to be used to update the state
 * @returns A tuple containing the current state and a dispatch function
 */
export function useOptimistic<T, P>(passthrough: T, reducer: (state: T, payload: P) => T) {
  const [value, setValue] = useState(passthrough);

  useEffect(() => {
    setValue(passthrough);
  }, [passthrough]);

  const reducerRef = useRef(reducer);
  useLayoutEffect(() => {
    reducerRef.current = reducer;
  }, []);

  const dispatch = useCallback(
    (payload: P) => {
      setValue(reducerRef.current(passthrough, payload));
    },
    [passthrough],
  );

  return [value, dispatch] as const;
}
