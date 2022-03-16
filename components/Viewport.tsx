import React from "react";
import * as PIXI from "pixi.js";
import { PixiComponent, useApp } from "@inlet/react-pixi";
import { Viewport as PixiViewport } from "pixi-viewport";

export interface ViewportProps {
  width: number;
  height: number;
  children?: React.ReactNode;
}

export interface PixiComponentViewportProps extends ViewportProps {
  app: PIXI.Application;
}

const PixiComponentViewport = PixiComponent("Viewport", {
  create: (props: PixiComponentViewportProps) => {
    const viewport = new PixiViewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: props.width,
      worldHeight: props.height,
      ticker: props.app.ticker,
      passiveWheel: false,
      interaction: props.app.renderer.plugins.interaction,
    });
    viewport.drag().decelerate().pinch().wheel().clampZoom({ minScale: 0.1 });

    requestAnimationFrame(() => {
      viewport.fit();
      viewport.moveCenter(props.width / 2, props.height / 2);
    });

    return viewport;
  },
});

export const Viewport = (props: ViewportProps) => {
  const app = useApp();
  return <PixiComponentViewport app={app} {...props} />;
};
