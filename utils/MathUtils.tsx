export class MathUtils {
  /**
   * Get a random number between two numbers
   * @param min - The minimum number
   * @param max - The maximum number
   * @returns A random number between min and max
   */
  static getRandomBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Get a percentage of a number from a total
   * @param value - The value to get the percentage of
   * @param total - The total to get the percentage from
   * @returns The percentage of value from total
   */
  static getPercentage(value: number, total: number) {
    return (value / total) * 100;
  }

  /**
   * Convert a value to a number
   * @param value
   */
  static toNumber(value?: string | number) {
    if (!value || Number.isNaN(Number(value))) {
      return 0;
    }

    const float = parseFloat(String(value));

    if (float % 1 === 0) {
      const int = parseInt(String(value), 10);
      return int;
    }

    return float;
  }
}
