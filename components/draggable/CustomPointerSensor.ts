import { PointerSensor } from '@dnd-kit/core';
import type { PointerEvent } from 'react';

/**
 * An extended "PointerSensor" that prevents some interactive HTML elements (button, input, textarea, select, option...) from dragging the element.
 * https://github.com/clauderic/dnd-kit/issues/477
 */
export class CustomPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown' as const,
      handler: ({ nativeEvent: event }: PointerEvent) => {
        if (!event.isPrimary || event.button !== 0 || isInteractiveElement(event.target as Element)) {
          return false;
        }

        return true;
      },
    },
  ];
}

/**
 * Check if the element (or its parent) is an interactive element
 * @param element - The element to check
 * @returns True if the element is an interactive element
 */
function isInteractiveElement(element: Element | null) {
  const interactiveElements = ['button', 'input', 'textarea', 'select', 'option'];

  if (element?.tagName && interactiveElements.includes(element.tagName.toLowerCase())) {
    return true;
  }

  if (element?.parentElement) {
    return isInteractiveElement(element.parentElement);
  }

  return false;
}
