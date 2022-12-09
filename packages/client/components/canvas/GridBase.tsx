import * as PIXI from 'pixi.js';
import { CustomPIXIComponent } from 'react-pixi-fiber';

interface IGridBaseProps {
  width: number;
  height: number;
  size: number;
  color: number;
}

export const GridBase = CustomPIXIComponent<PIXI.Graphics, IGridBaseProps>(
  {
    customDisplayObject: () => new PIXI.Graphics(),
    customApplyProps: (instance, oldProps, newProps) => {
      const { width, height, size, color } = newProps;

      // Clear the grid
      instance.clear();

      // Calculate the number of rows and columns
      const rows = width / size;
      const columns = height / size;

      // Draw the grid
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          instance.lineStyle(1, color);
          instance.drawRect(row * size, column * size, size, size);
          instance.endFill();
        }
      }

      // Clip the grid to the canvas
      instance.x = 0;
      instance.y = 0;
      instance.width = width;
      instance.height = height;
    },
  },
  'GridBase',
);
