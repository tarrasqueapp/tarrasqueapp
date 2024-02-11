import { create } from 'zustand';

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

interface ToolbarStore {
  tool: Tool;
  selectTool: SelectTool;
  fogTool: FogTool;
  drawTool: DrawTool;
  shapeTool: ShapeTool;
  setTool: (tool: Tool) => void;
  setSelectTool: (selectTool: SelectTool) => void;
  setFogTool: (fogTool: FogTool) => void;
  setDrawTool: (drawTool: DrawTool) => void;
  setShapeTool: (shapeTool: ShapeTool) => void;
}

export const useToolbarStore = create<ToolbarStore>((set) => ({
  tool: Tool.Select,
  selectTool: SelectTool.Single,
  fogTool: FogTool.Hide,
  drawTool: DrawTool.Brush,
  shapeTool: ShapeTool.Circle,

  /**
   * Set selected tool
   * @param tool - The tool to select
   */
  setTool: (tool) => set(() => ({ tool })),

  /**
   * Set selected select tool
   * @param selectTool - The select tool variant to select
   */
  setSelectTool: (selectTool) => set(() => ({ selectTool })),

  /**
   * Set selected fog tool
   * @param fogTool - The fog tool variant to select
   */
  setFogTool: (fogTool) => set(() => ({ fogTool })),

  /**
   * Set selected draw tool
   * @param drawTool - The draw tool variant to select
   */
  setDrawTool: (drawTool) => set(() => ({ drawTool })),

  /**
   * Set selected shape tool
   * @param shapeTool - The shape tool variant to select
   */
  setShapeTool: (shapeTool) => set(() => ({ shapeTool })),
}));
