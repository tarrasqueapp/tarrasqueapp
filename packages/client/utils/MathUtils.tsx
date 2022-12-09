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
}
