import { Grid as GridInterface, Map } from '@tarrasque/common';
import * as PIXI from 'pixi.js';

interface GridProps {
  map: Map;
  grid: GridInterface;
}

export class Grid {
  private container: PIXI.Container;
  private graphics: PIXI.Graphics;
  private extraRowsColumns = 50;
  private map: Map;
  private grid: GridInterface;

  constructor(props: GridProps) {
    this.map = props.map;
    this.grid = props.grid;

    // Create the container and graphics
    this.container = new PIXI.Container();
    this.graphics = new PIXI.Graphics();
    this.container.addChild(this.graphics);

    if (this.grid.visible) {
      // Draw the grid based on the grid type
      switch (this.grid.type) {
        case 'SQUARE':
          this.drawSquareGrid();
          break;
        case 'HEX_HORIZONTAL':
          // this.drawHexHorizontalGrid();
          break;
        case 'HEX_VERTICAL':
          // this.drawHexVerticalGrid();
          break;
      }
    }
  }

  drawSquareGrid() {
    if (!this.map.media.width || !this.map.media.height) return;

    const color = new PIXI.Color(this.grid.color);
    this.graphics.stroke({ width: 1, color });

    // Determine the number of squares that fit horizontally and vertically
    const columns = Math.ceil(this.map.media.width / this.grid.width) + this.extraRowsColumns;
    const rows = Math.ceil(this.map.media.height / this.grid.height) + this.extraRowsColumns;

    // Draw the grid
    for (let row = -this.extraRowsColumns; row < rows; row++) {
      for (let col = -this.extraRowsColumns; col < columns; col++) {
        this.graphics.rect(
          col * this.grid.width + this.grid.offset_x,
          row * this.grid.height + this.grid.offset_y,
          this.grid.width,
          this.grid.height,
        );
      }
    }
  }
}
