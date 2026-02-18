import { Directive, input, computed } from '@angular/core';
import { cn } from './cn';

/**
 * Scrollable container for search items. Provides the listbox role for accessibility.
 *
 * @example
 * ```html
 * <sng-search-input>
 *   <sng-search-input-list>
 *     <sng-search-input-group heading="Actions">
 *       <sng-search-input-item>Copy</sng-search-input-item>
 *       <sng-search-input-item>Paste</sng-search-input-item>
 *     </sng-search-input-group>
 *   </sng-search-input-list>
 * </sng-search-input>
 * ```
 */
@Directive({
  selector: 'sng-search-input-list',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
    'role': 'listbox',
  },
})
export class SngSearchInputList {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('block max-h-72 overflow-y-auto overflow-x-hidden p-1', this.class())
  );
}
