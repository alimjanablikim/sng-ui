import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { cn } from './cn';

/**
 * Card header section for title and description.
 *
 * Contains the card's heading content, typically a title and optional description.
 * Use with `sng-card-title` and `sng-card-description` directives.
 *
 * @example
 * ```html
 * <sng-card-header>
 *   <sng-card-title>Account Settings</sng-card-title>
 *   <sng-card-description>Manage your account preferences.</sng-card-description>
 * </sng-card-header>
 * ```
 */
@Component({
  selector: 'sng-card-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngCardHeader {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('flex flex-col gap-1.5 px-6', this.class())
  );
}
