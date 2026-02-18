import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { cn } from './cn';

/**
 * Card content section for main body content.
 *
 * Contains the primary content of the card such as forms,
 * data displays, images, or any other content.
 *
 * @example
 * ```html
 * <sng-card-content>
 *   <form>
 *     <label>Project Name</label>
 *     <input type="text" />
 *   </form>
 * </sng-card-content>
 * ```
 */
@Component({
  selector: 'sng-card-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngCardContent {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('px-6', this.class())
  );
}
