import { Directive, input, computed } from '@angular/core';
import { cn } from './cn';

/**
 * Container directive for select dropdown content with proper padding.
 *
 * @example
 * ```html
 * <sng-select-content>
 *   <sng-select-item value="1">Option 1</sng-select-item>
 *   <sng-select-item value="2">Option 2</sng-select-item>
 * </sng-select-content>
 * ```
 */
@Directive({
  selector: 'sng-select-content',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngSelectContent {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() => cn('p-1', this.class()));
}
