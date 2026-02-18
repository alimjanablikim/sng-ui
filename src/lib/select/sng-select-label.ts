import { Directive, input, computed } from '@angular/core';
import { cn } from './cn';

/**
 * Label directive for a select group with semibold styling.
 *
 * @example
 * ```html
 * <sng-select-group>
 *   <sng-select-label>Category Name</sng-select-label>
 *   <sng-select-item value="1">Option 1</sng-select-item>
 * </sng-select-group>
 * ```
 */
@Directive({
  selector: 'sng-select-label',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngSelectLabel {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('px-2 py-1.5 text-sm font-semibold text-foreground', this.class())
  );
}
