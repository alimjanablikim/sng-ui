import { Directive, input, computed } from '@angular/core';
import { cn } from './cn';

/**
 * Visual separator between search groups or items.
 *
 * @example
 * ```html
 * <sng-search-input-list>
 *   <sng-search-input-group heading="Actions">
 *     <sng-search-input-item>Copy</sng-search-input-item>
 *   </sng-search-input-group>
 *   <sng-search-input-separator />
 *   <sng-search-input-group heading="Settings">
 *     <sng-search-input-item>Profile</sng-search-input-item>
 *   </sng-search-input-group>
 * </sng-search-input-list>
 * ```
 */
@Directive({
  selector: 'sng-search-input-separator',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngSearchInputSeparator {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() => cn('block -mx-1 h-px my-1 bg-border', this.class()));
}
