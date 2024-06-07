import { DrawTool, FogTool, SelectTool, ShapeTool, Tool } from '@tarrasque/common';

import { EventEmitter } from '../EventEmitter';

export class ToolApi {
  private emitter: EventEmitter;

  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
  }

  async getTool() {
    return this.emitter.emit('GET_TOOL');
  }

  async setTool(tool: Tool) {
    return this.emitter.emit('SET_TOOL', tool);
  }

  async getSelectTool() {
    return this.emitter.emit('GET_SELECT_TOOL');
  }

  async setSelectTool(selectTool: SelectTool) {
    return this.emitter.emit('SET_SELECT_TOOL', selectTool);
  }

  async getFogTool() {
    return this.emitter.emit('GET_FOG_TOOL');
  }

  async setFogTool(fogTool: FogTool) {
    return this.emitter.emit('SET_FOG_TOOL', fogTool);
  }

  async getDrawTool() {
    return this.emitter.emit('GET_DRAW_TOOL');
  }

  async setDrawTool(drawTool: DrawTool) {
    return this.emitter.emit('SET_DRAW_TOOL', drawTool);
  }

  async getShapeTool() {
    return this.emitter.emit('GET_SHAPE_TOOL');
  }

  async setShapeTool(shapeTool: ShapeTool) {
    return this.emitter.emit('SET_SHAPE_TOOL', shapeTool);
  }
}
