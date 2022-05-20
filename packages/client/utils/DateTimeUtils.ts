export class DateTimeUtils {
  /**
   * Get the milliseconds in a duration
   * @param duration - a duration string
   * @returns the number of milliseconds in the given duration
   */
  static toMillisecondsFromString(duration: string): number {
    const match = duration.match(/^(\d+)([a-z]+)$/);
    if (!match) {
      throw new Error(`Invalid duration: ${duration}`);
    }
    const [, value, unit] = match;
    return parseInt(value, 10) * DateTimeUtils.getMillisecondsMultiplier(unit);
  }

  /**
   * Get the milliseconds multiplier for a duration unit
   * @param unit - a unit of time
   * @returns the number of milliseconds in the given unit
   */
  static getMillisecondsMultiplier(unit: string): number {
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
}
