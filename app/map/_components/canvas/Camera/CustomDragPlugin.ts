import { Drag, Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';

import { SelectTool, Tool, useToolbarStore } from '@/store/toolbar';

/**
 * Extends the Drag plugin to allow for custom drag behavior.
 */
export class CustomDragPlugin extends Drag {
  private originalDown: (event: PIXI.FederatedPointerEvent) => boolean;
  private spacebarPressed: boolean;
  private dragPlugin: Drag;

  constructor(parent: Viewport) {
    super(parent);
    this.dragPlugin = new Drag(parent);

    // Save the original down handler of the drag plugin
    this.originalDown = this.dragPlugin.down.bind(this);

    // State to track if the spacebar is pressed
    this.spacebarPressed = false;

    // Set up keyboard event listeners for spacebar
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  /**
   * Custom mouse down handler that initiates drag on certain conditions.
   * @param {PIXI.FederatedPointerEvent} event - The pointer event.
   * @returns {boolean} - Whether the event should be handled.
   */
  public override down(event: PIXI.FederatedPointerEvent): boolean {
    const { tool, selectTool } = useToolbarStore.getState();

    // Check for specific tool selection or mouse button conditions
    const isSingleSelectTool = tool === Tool.Select && selectTool === SelectTool.Single;
    const isMiddleMouseButton = event.nativeEvent.button === 1;

    // Initiate drag for the applicable conditions
    if (isSingleSelectTool || isMiddleMouseButton || this.spacebarPressed) {
      return this.originalDown(event);
    }

    // Otherwise, don't handle the event
    return false;
  }

  /**
   * Key down handler to track spacebar press state
   * @param event - The keyboard event
   */
  private onKeyDown(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.spacebarPressed = true;
    }
  }

  /**
   * Key up handler to track spacebar release state
   * @param event - The keyboard event
   */
  private onKeyUp(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.spacebarPressed = false;
    }
  }
}
