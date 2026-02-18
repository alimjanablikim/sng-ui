import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { cn } from './cn';

/**
 * Card footer section for actions and supplementary content.
 *
 * Contains action buttons, links, or other footer content.
 * Automatically applies flex layout for horizontal button alignment.
 *
 * @example
 * ```html
 * <sng-card-footer>
 *   <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground">Cancel</sng-button>
 *   <sng-button class="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90">Save Changes</sng-button>
 * </sng-card-footer>
 * ```
 */
@Component({
  selector: 'sng-card-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngCardFooter {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('flex items-center px-6', this.class())
  );
}
