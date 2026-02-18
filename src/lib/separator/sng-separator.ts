import { Component, input, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { cn } from './cn';

/**
 * Visual separator for dividing content sections.
 * Uses semantic `role="separator"` for accessibility.
 *
 * @example
 * ```html
 * <sng-separator />
 * <sng-separator orientation="vertical" class="h-6" />
 * ```
 */
@Component({
  selector: 'sng-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'role': 'separator',
    '[attr.aria-orientation]': 'orientation()',
    '[class]': 'hostClasses()',
  },
  template: ``,
})
export class SngSeparator {
  /** Custom CSS classes. */
  class = input<string>('');

  /** Orientation of the separator line. */
  orientation = input<'horizontal' | 'vertical'>('horizontal');

  hostClasses = computed(() =>
    cn(
      'shrink-0 bg-border',
      this.orientation() === 'vertical' ? 'h-full w-px' : 'block h-px w-full',
      this.class()
    )
  );
}
