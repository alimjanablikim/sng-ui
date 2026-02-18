import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, computed } from '@angular/core';
import { cn } from './cn';

/**
 * Progress bar for displaying completion status.
 * Uses semantic `role="progressbar"` with proper ARIA attributes.
 * Supports horizontal and vertical orientations.
 *
 * @example
 * ```html
 * <sng-progress [value]="33" />
 * <sng-progress [value]="66" orientation="vertical" class="h-48" />
 * ```
 */
@Component({
  selector: 'sng-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'role': 'progressbar',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': '100',
    '[attr.aria-valuenow]': 'clampedValue()',
    '[attr.aria-orientation]': 'orientation()',
    '[class]': 'hostClasses()',
  },
  template: `
    <div
      [class]="indicatorClasses()"
      [style.transform]="indicatorTransform()">
    </div>
  `,
})
export class SngProgress {
  /** Custom CSS classes. */
  class = input<string>('');

  /** Current progress value (0-100). */
  value = input<number>(0);

  /** Orientation of the progress bar. */
  orientation = input<'horizontal' | 'vertical'>('horizontal');

  hostClasses = computed(() =>
    cn(
      'relative block overflow-hidden rounded-full bg-current/20 text-primary',
      this.orientation() === 'vertical' ? 'w-2 h-full' : 'h-2 w-full',
      this.class()
    )
  );

  indicatorClasses = computed(() =>
    cn('h-full w-full flex-1 bg-current transition-transform')
  );

  clampedValue = computed(() => Math.max(0, Math.min(100, this.value())));

  indicatorTransform = computed(() => {
    const remaining = 100 - this.clampedValue();
    return this.orientation() === 'vertical'
      ? `translateY(${remaining}%)`
      : `translateX(-${remaining}%)`;
  });
}
