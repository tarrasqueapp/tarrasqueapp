import { makeAutoObservable } from 'mobx';

export enum Tool {
  Select = 'select',
  Fog = 'fog',
  Draw = 'draw',
  Shape = 'shape',
  Measure = 'measure',
  Note = 'note',
}

export enum SelectTool {
  Single = 'single',
  Multi = 'multi',
}

export enum FogTool {
  Hide = 'hide',
  Show = 'show',
}

export enum DrawTool {
  Brush = 'brush',
  Eraser = 'eraser',
}

export enum ShapeTool {
  Circle = 'circle',
  Rectangle = 'rectangle',
  Triangle = 'triangle',
}

class ToolbarStore {
  tool = Tool.Select;
  selectTool = SelectTool.Single;
  fogTool = FogTool.Hide;
  drawTool = DrawTool.Brush;
  shapeTool = ShapeTool.Circle;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Set selected tool
   * @param tool - The tool to select
   */
  setTool(tool: Tool) {
    this.tool = tool;
  }

  /**
   * Set selected select tool
   * @param selectTool - The select tool variant to select
   */
  setSelectTool(selectTool: SelectTool) {
    this.selectTool = selectTool;
  }

  /**
   * Set selected fog tool
   * @param fogTool - The fog tool variant to select
   */
  setFogTool(fogTool: FogTool) {
    this.fogTool = fogTool;
  }

  /**
   * Set selected draw tool
   * @param drawTool - The draw tool variant to select
   */
  setDrawTool(drawTool: DrawTool) {
    this.drawTool = drawTool;
  }

  /**
   * Set selected shape tool
   * @param shapeTool - The shape tool variant to select
   */
  setShapeTool(shapeTool: ShapeTool) {
    this.shapeTool = shapeTool;
  }
}

export const toolbarStore = new ToolbarStore();
