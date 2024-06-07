import { debounce } from '@mui/material';
import { DefaultError, UseMutationOptions, UseMutationResult, useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';

/**
 * A generic hook for performing debounced mutations and query invalidations.
 * @param options React Query's UseMutationOptions including the mutation function.
 * @param debounceMs The debounce delay in milliseconds.
 * @returns A UseMutationResult with debounced mutation execution.
 */
export function useDebouncedMutation<TData = unknown, TError = DefaultError, TVariables = void, TContext = unknown>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
  debounceMs = 500,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const debouncedMutationFn = useCallback(
    debounce(async (variables: TVariables) => options.mutationFn!(variables), debounceMs),
    [],
  );

  // Debounce the onSettled callback
  const debouncedOnSettled = useCallback(
    debounce((data: TData | undefined, error: TError | null, variables: TVariables, context: TContext | undefined) => {
      options.onSettled?.(data, error, variables, context);
    }, debounceMs),
    [],
  );

  // Use the original useMutation hook with our debounced mutation function
  return useMutation<TData, TError, TVariables, TContext>({
    ...options,
    mutationFn: debouncedMutationFn,
    onSettled: (data, error, variables, context) => {
      debouncedOnSettled(data, error, variables, context);
    },
  });
}
