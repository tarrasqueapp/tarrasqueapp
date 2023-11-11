import { exec } from 'child_process';

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

/**
 * Get the milliseconds in a duration
 * @param duration - A duration string
 * @returns The number of milliseconds in the given duration
 */
export function toMillisecondsFromString(duration: string): number {
  const match = duration.match(/^(\d+)([a-z]+)$/);
  if (!match) {
    throw new Error(`Invalid duration: ${duration}`);
  }
  const [, value, unit] = match;
  return parseInt(value, 10) * getMillisecondsMultiplier(unit);
}

/**
 * Transform a duration string into a date
 * @param duration - A duration string
 * @returns The date
 */
export function durationToDate(duration: string): Date {
  return new Date(Date.now() + toMillisecondsFromString(duration));
}

/**
 * Get the milliseconds multiplier for a duration unit
 * @param unit - A unit of time
 * @returns The number of milliseconds in the given unit
 */
export function getMillisecondsMultiplier(unit: string): number {
  switch (unit) {
    case 's':
      return 1000;
    case 'm':
      return 1000 * 60;
    case 'h':
      return 1000 * 60 * 60;
    case 'd':
      return 1000 * 60 * 60 * 24;
    default:
      throw new Error(`Unknown unit: ${unit}`);
  }
}

/**
 * Runs a shell command and returns its standard output
 * @param command - The shell command to run
 * @returns A promise that resolves with the standard output of the command
 */
export function run(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`stderr: ${stderr}`);
        return;
      }
      resolve(stdout);
    });
  });
}
