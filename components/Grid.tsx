import React from "react";
import * as PIXI from "pixi.js";
import { PixiComponent, useApp } from "@inlet/react-pixi";
import { GraphPaper, GraphStyle } from "pixi-graphpaper";

export interface GridProps {
  graphWidth: number;
  graphHeight: number;
  minorGridSize: number;
  minorStrokeWidth: number;
}

export interface PixiComponentGridProps extends GridProps {
  app: PIXI.Application;
}

const PixiComponentGrid = PixiComponent("Grid", {
  create: (props: PixiComponentGridProps) => {
    const paper = new GraphPaper({
      intermediateGridVisible: false,
      majorGridVisible: false,
      ...props,
    });

    return paper;
  },
});

export const Grid = (props: GridProps) => {
  const app = useApp();
  return <PixiComponentGrid app={app} {...props} />;
};
