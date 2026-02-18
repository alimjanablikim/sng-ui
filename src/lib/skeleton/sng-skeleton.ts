import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { cn } from './cn';

/**
 * Skeleton loading placeholder for content that is still loading.
 *
 * Displays a pulsing animated placeholder that mimics the shape of content
 * to reduce perceived loading time and layout shift.
 *
 * Customize shape via the `class` input:
 * - Default (rounded rectangle): no extra classes needed
 * - Circular (avatars): class="rounded-full h-12 w-12"
 * - Text line: class="rounded h-4 w-full"
 *
 * @example
 * ```html
 * <!-- Basic skeleton -->
 * <sng-skeleton class="h-4 w-[250px]" />
 *
 * <!-- Card skeleton -->
 * <div class="flex items-center space-x-4">
 *   <sng-skeleton class="h-12 w-12 rounded-full" />
 *   <div class="space-y-2">
 *     <sng-skeleton class="h-4 w-[250px]" />
 *     <sng-skeleton class="h-4 w-[200px]" />
 *   </div>
 * </div>
 * ```
 */
@Component({
  selector: 'sng-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: ``,
})
export class SngSkeleton {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn(
      'bg-accent block animate-pulse rounded-md',
      this.class()
    )
  );
}
