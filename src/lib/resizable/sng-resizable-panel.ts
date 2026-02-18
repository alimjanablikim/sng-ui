import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  signal,
} from '@angular/core';
import { cn } from './cn';

/**
 * A resizable panel that can be placed inside a resizable group.
 * Supports size constraints and default sizing.
 *
 * @example
 * ```html
 * <sng-resizable-group direction="horizontal">
 *   <sng-resizable-panel [defaultSize]="30" [minSize]="20" [maxSize]="50">
 *     <div class="p-4">Sidebar content</div>
 *   </sng-resizable-panel>
 *   <sng-resizable-handle />
 *   <sng-resizable-panel [defaultSize]="70">
 *     <div class="p-4">Main content</div>
 *   </sng-resizable-panel>
 * </sng-resizable-group>
 * ```
 */
@Component({
  selector: 'sng-resizable-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[style.flex-basis.%]': 'size()',
    '[style.flex-grow]': '"0"',
    '[style.flex-shrink]': '"0"',
    '[attr.data-panel]': '"true"',
  },
  template: `<ng-content />`,
})
export class SngResizablePanel {
  /**
   * The initial size of the panel as a percentage (0-100).
   * If not specified, remaining space is distributed equally among panels without defaults.
   */
  defaultSize = input<number>();

  /**
   * The minimum size of the panel as a percentage (0-100).
   */
  minSize = input<number>();

  /**
   * The maximum size of the panel as a percentage (0-100).
   */
  maxSize = input<number>();

  /** Custom CSS classes. */
  class = input<string>('');

  // Internal size state (percentage)
  size = signal<number>(50);

  hostClasses = computed(() =>
    cn('overflow-hidden', this.class())
  );

  /** @internal */
  _setSize(size: number) {
    this.size.set(size);
  }
}
