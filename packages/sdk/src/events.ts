import { Coordinates, DrawTool, FogTool, Grid, SelectTool, ShapeTool, Tool } from '@tarrasque/common';

export type Commands = {
  // Grid
  GET_GRID: { payload: void; response: Grid };
  GET_GRID_TYPE: { payload: void; response: Grid['type'] };
  SET_GRID_TYPE: { payload: Grid['type']; response: void };
  GET_GRID_WIDTH: { payload: void; response: Grid['width'] };
  SET_GRID_WIDTH: { payload: Grid['width']; response: void };
  GET_GRID_HEIGHT: { payload: void; response: Grid['height'] };
  SET_GRID_HEIGHT: { payload: Grid['height']; response: void };
  GET_GRID_OFFSET_X: { payload: void; response: Grid['offset_x'] };
  SET_GRID_OFFSET_X: { payload: Grid['offset_x']; response: void };
  GET_GRID_OFFSET_Y: { payload: void; response: Grid['offset_y'] };
  SET_GRID_OFFSET_Y: { payload: Grid['offset_y']; response: void };
  GET_GRID_COLOR: { payload: void; response: Grid['color'] };
  SET_GRID_COLOR: { payload: Grid['color']; response: void };
  GET_GRID_SNAP: { payload: void; response: Grid['snap'] };
  SET_GRID_SNAP: { payload: Grid['snap']; response: void };
  GET_GRID_VISIBLE: { payload: void; response: Grid['visible'] };
  SET_GRID_VISIBLE: { payload: Grid['visible']; response: void };
  GET_GRID_ALIGNING_STATUS: { payload: void; response: boolean };
  SET_GRID_ALIGNING_STATUS: { payload: boolean; response: void };
  // Camera
  GET_CAMERA_COORDINATES: { payload: void; response: Coordinates };
  SET_CAMERA_COORDINATES: { payload: Coordinates; response: void };
  GET_CAMERA_SCALE: { payload: void; response: number };
  SET_CAMERA_SCALE: { payload: number; response: void };
  ZOOM_IN: { payload: void; response: void };
  ZOOM_OUT: { payload: void; response: void };
  ZOOM_TO_FIT: { payload: void; response: void };
  ANIMATE_TO: { payload: { coordinates: Coordinates; scale: number }; response: void };
  // Tool
  GET_TOOL: { payload: void; response: Tool };
  SET_TOOL: { payload: Tool; response: void };
  GET_SELECT_TOOL: { payload: void; response: SelectTool };
  SET_SELECT_TOOL: { payload: SelectTool; response: void };
  GET_FOG_TOOL: { payload: void; response: FogTool };
  SET_FOG_TOOL: { payload: FogTool; response: void };
  GET_DRAW_TOOL: { payload: void; response: DrawTool };
  SET_DRAW_TOOL: { payload: DrawTool; response: void };
  GET_SHAPE_TOOL: { payload: void; response: ShapeTool };
  SET_SHAPE_TOOL: { payload: ShapeTool; response: void };
};

export type Events = {
  // Global
  LOADED: { payload: void; response: void };
  // Camera
  CAMERA_MOVED: { payload: Coordinates; response: void };
};

export type Messages = Commands & Events;

// Define event names, event payloads, and event responses
export type MessageName = keyof Messages;
export type MessagePayload<T extends MessageName> = Messages[T]['payload'] extends void ? [] : [Messages[T]['payload']];
export type MessageResponse<T extends MessageName> = Messages[T]['response'];
export type MessageListener<T extends MessageName> = (data: MessagePayload<T>) => void;
