import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { cn } from './cn';

/**
 * Card container for grouping related content with a consistent visual boundary.
 *
 * Cards are versatile containers used for displaying content in a clearly delineated area.
 * Use them for dashboards, settings panels, product displays, or any grouped content.
 *
 * @example
 * ```html
 * <sng-card>
 *   <sng-card-header>
 *     <sng-card-title>Create project</sng-card-title>
 *     <sng-card-description>Deploy your new project in one-click.</sng-card-description>
 *   </sng-card-header>
 *   <sng-card-content>
 *     <!-- Form fields or content here -->
 *   </sng-card-content>
 *   <sng-card-footer>
 *     <sng-button>Cancel</sng-button>
 *     <sng-button>Deploy</sng-button>
 *   </sng-card-footer>
 * </sng-card>
 * ```
 */
@Component({
  selector: 'sng-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngCard {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('flex flex-col gap-6 rounded-xl border border-border bg-card text-card-foreground py-6 shadow-sm', this.class())
  );
}
