export enum Color {
  // Black
  BLACK = '#000000',
  BLACK_LIGHT = '#181410',
  // White
  WHITE = '#ffffff',
  // Brown
  Brown = '#9b7d65',
  BROWN_LIGHT = '#e3b38b',
  BROWN_DARK = '#5c443c',
  BROWN_VERY_DARK = '#241d18',
  // Purple
  PURPLE = '#475268',
  PURPLE_DARK = '#242330',
  // Grey
  GREY = '#b4b4b4',

  // MUI
  // Blue
  BLUE = '#4987c5',
  // Red
  RED = '#f25757',
  // Orange
  ORANGE = '#C58544',
  // Green
  GREEN = '#6c9245',
}

export const Gradient = {
  Linear: `linear-gradient(120deg, ${Color.BLACK_LIGHT} 0%, ${Color.BROWN_DARK} 50%, ${Color.PURPLE_DARK} 100%)`,
};
