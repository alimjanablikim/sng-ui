import { Component, input, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { cn } from './cn';

/**
 * Alert displays a callout for user attention.
 * Uses CSS Grid to align optional icon with title/description.
 *
 * @example
 * ```html
 * <sng-alert>
 *   <sng-alert-title>Heads up!</sng-alert-title>
 *   <sng-alert-description>You can customize this component.</sng-alert-description>
 * </sng-alert>
 * ```
 */
@Component({
  selector: 'sng-alert',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    sng-alert:has(> svg),
    sng-alert:has(> sng-icon) {
      grid-template-columns: calc(var(--spacing) * 4) 1fr;
      column-gap: 0.75rem;
    }

    sng-alert > svg {
      width: 1rem;
      height: 1rem;
      transform: translateY(0.125rem);
      color: currentColor;
    }

    sng-alert > sng-icon {
      transform: translateY(0.125rem);
      color: currentColor;
    }
  `],
  host: {
    role: 'alert',
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngAlert {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn(
      'relative w-full rounded-lg border px-4 py-3 text-sm',
      'bg-card text-card-foreground',
      'grid grid-cols-[0_1fr] gap-y-0.5 items-start',
      this.class()
    )
  );
}
