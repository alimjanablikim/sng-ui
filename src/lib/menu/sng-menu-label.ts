import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  booleanAttribute,
} from '@angular/core';
import { cn } from './cn';

/**
 * Non-interactive label for grouping or describing menu sections.
 *
 * @example
 * ```html
 * <sng-menu>
 *   <sng-menu-label>Actions</sng-menu-label>
 *   <sng-menu-item>Edit</sng-menu-item>
 *   <sng-menu-item>Delete</sng-menu-item>
 * </sng-menu>
 * ```
 */
@Component({
  selector: 'sng-menu-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngMenuLabel {
  /** Custom CSS classes. */
  class = input<string>('');

  /**
   * Whether to add left padding for alignment with checkbox/radio items.
   */
  inset = input(false, { transform: booleanAttribute });

  hostClasses = computed(() =>
    cn(
      'px-2 py-1.5 text-sm font-semibold text-foreground',
      this.inset() && 'pl-8',
      this.class()
    )
  );
}
