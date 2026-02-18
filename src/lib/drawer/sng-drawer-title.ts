import { Directive, input, computed } from '@angular/core';
import { cn } from './cn';

/**
 * Title element for the drawer header.
 * Renders as a semibold text element.
 *
 * @example
 * ```html
 * <sng-drawer-title>Settings</sng-drawer-title>
 * ```
 */
@Directive({
  selector: 'sng-drawer-title',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngDrawerTitle {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('text-foreground font-semibold', this.class())
  );
}
