import { Color, Grid as GridInterface, Map } from '@tarrasque/common';
import { TarrasqueSDK } from '@tarrasque/sdk';
import * as PIXI from 'pixi.js';

import { Grid } from './Grid';
import { Camera } from './camera/Camera';

interface ApplicationProps {
  sdk: TarrasqueSDK;
  map: Map;
  grid: GridInterface;
}

export class Application {
  app: PIXI.Application;
  camera: Camera;
  grid: Grid;

  constructor({ sdk, map, grid }: ApplicationProps) {
    this.app = new PIXI.Application();

    this.app.init({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: new PIXI.Color(Color.BLACK).toNumber(),
    });

    this.camera = new Camera({ app: this.app, sdk, map });
    this.grid = new Grid({ map, grid });
  }
}
