import { Directive, input, computed } from '@angular/core';
import { cn } from './cn';

/**
 * Displays muted trailing hint text inside a search item.
 *
 * @example
 * ```html
 * <sng-search-input-item>
 *   Profile
 *   <sng-search-input-shortcut>Beta</sng-search-input-shortcut>
 * </sng-search-input-item>
 * ```
 */
@Directive({
  selector: 'sng-search-input-shortcut',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngSearchInputShortcut {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('ml-auto text-xs tracking-widest text-muted-foreground', this.class())
  );
}
