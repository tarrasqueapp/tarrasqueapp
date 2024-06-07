import { SelectTool, Tool } from '@tarrasque/common';
import { Drag, Viewport } from '@tarrasque/pixi-viewport';
import { TarrasqueSDK } from '@tarrasque/sdk';
import * as PIXI from 'pixi.js';

/**
 * Extends the Drag plugin to allow for custom drag behavior.
 */
export class CustomDragPlugin extends Drag {
  private sdk: TarrasqueSDK;
  private originalDown: (event: PIXI.FederatedPointerEvent) => Promise<boolean>;
  private spacebarPressed: boolean;
  private dragPlugin: Drag;

  constructor(parent: Viewport, sdk: TarrasqueSDK) {
    super(parent);
    this.sdk = sdk;
    this.dragPlugin = new Drag(parent);

    // Save the original down handler of the drag plugin
    this.originalDown = this.dragPlugin.down.bind(this);

    // State to track if the spacebar is pressed
    this.spacebarPressed = false;

    // Set up keyboard event listeners for spacebar
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  destroy(): void {
    window.removeEventListener('keydown', this.onKeyDown.bind(this));
    window.removeEventListener('keyup', this.onKeyUp.bind(this));
  }

  /**
   * Custom mouse down handler that initiates drag on certain conditions.
   * @param {PIXI.FederatedPointerEvent} event - The pointer event.
   * @returns {boolean} - Whether the event should be handled.
   */
  public override async down(event: PIXI.FederatedPointerEvent): Promise<boolean> {
    const [tool, selectTool, aligningGrid] = await Promise.all([
      this.sdk.tool.getTool(),
      this.sdk.tool.getSelectTool(),
      this.sdk.grid.getAligningStatus(),
    ]);

    // Check for specific tool selection or mouse button conditions
    const isSingleSelectTool = tool === Tool.Select && selectTool === SelectTool.Single;
    const isMiddleMouseButton = event.nativeEvent.button === 1;

    // Initiate drag for the applicable conditions
    if ((isSingleSelectTool && !aligningGrid) || isMiddleMouseButton || this.spacebarPressed) {
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
