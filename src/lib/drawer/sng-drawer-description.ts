import { Directive, input, computed } from '@angular/core';
import { cn } from './cn';

/**
 * Description text for the drawer header.
 * Renders as muted, smaller text below the title.
 *
 * @example
 * ```html
 * <sng-drawer-description>
 *   Set your daily activity goal to track your progress.
 * </sng-drawer-description>
 * ```
 */
@Directive({
  selector: 'sng-drawer-description',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngDrawerDescription {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('text-sm text-muted-foreground', this.class())
  );
}
