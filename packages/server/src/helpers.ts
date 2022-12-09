/**
 * Exclude fields from a type T based on a list of keys K (which must be a subset of T) and return a new type
 * @param fields - The initial fields
 * @param excluded - The fields to exclude
 * @returns The new type
 */
export function excludeFields<T, K extends (keyof T)[]>(
  fields: T,
  excluded: K,
): Record<Exclude<keyof T, K[number]>, boolean> {
  const result = {} as Record<Exclude<keyof T, K[number]>, boolean>;
  for (const key of Object.keys(fields)) {
    if (!excluded.includes(key as any)) {
      result[key as Exclude<keyof T, K[number]>] = true;
    }
  }
  return result;
}
