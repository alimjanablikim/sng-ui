import { Directive, input, computed } from '@angular/core';
import { cn } from './cn';

/**
 * Groups related select items together with proper ARIA semantics.
 *
 * @example
 * ```html
 * <sng-select-group>
 *   <sng-select-label>Fruits</sng-select-label>
 *   <sng-select-item value="apple">Apple</sng-select-item>
 *   <sng-select-item value="banana">Banana</sng-select-item>
 * </sng-select-group>
 * ```
 */
@Directive({
  selector: 'sng-select-group',
  standalone: true,
  host: {
    role: 'group',
    '[class]': 'hostClasses()',
  },
})
export class SngSelectGroup {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() => cn('block p-1', this.class()));
}
