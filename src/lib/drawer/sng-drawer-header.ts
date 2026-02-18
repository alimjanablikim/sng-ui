import { Directive, input, computed } from '@angular/core';
import { cn } from './cn';

/**
 * Header section for the drawer containing title and description.
 * Centers text on mobile and aligns left on larger screens.
 *
 * @example
 * ```html
 * <sng-drawer-header>
 *   <sng-drawer-title>Move Goal</sng-drawer-title>
 *   <sng-drawer-description>Set your daily activity goal.</sng-drawer-description>
 * </sng-drawer-header>
 * ```
 */
@Directive({
  selector: 'sng-drawer-header',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngDrawerHeader {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('flex flex-col gap-1.5 p-4 text-center sm:text-left', this.class())
  );
}
