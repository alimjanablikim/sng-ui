import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { cn } from './cn';

/**
 * Visual separator between select items or groups.
 *
 * @example
 * ```html
 * <sng-select-item value="1">Option 1</sng-select-item>
 * <sng-select-separator />
 * <sng-select-item value="2">Option 2</sng-select-item>
 * ```
 */
@Component({
  selector: 'sng-select-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'separator',
    '[class]': 'hostClasses()',
  },
  template: '',
})
export class SngSelectSeparator {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() => cn('block my-1 h-px bg-border', this.class()));
}
