import { Directive, input, computed } from '@angular/core';
import { cn } from './cn';

/**
 * Visual drag handle indicator for the drawer.
 * Typically placed at the top of drawer content to indicate drag capability.
 *
 * @example
 * ```html
 * <sng-drawer-content>
 *   <sng-drawer-handle></sng-drawer-handle>
 *   <sng-drawer-header>...</sng-drawer-header>
 * </sng-drawer-content>
 * ```
 */
@Directive({
  selector: 'sng-drawer-handle',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngDrawerHandle {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('bg-muted mx-auto mt-4 h-2 w-[100px] shrink-0 rounded-full', this.class())
  );
}
