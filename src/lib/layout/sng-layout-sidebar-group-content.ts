import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * Container for the menu items within a sidebar group.
 * Wraps the menu and applies appropriate spacing.
 *
 * @example
 * ```html
 * <sng-layout-sidebar-group>
 *   <sng-layout-sidebar-group-label>Navigation</sng-layout-sidebar-group-label>
 *   <sng-layout-sidebar-group-content>
 *     <sng-layout-sidebar-menu>
 *       <sng-layout-sidebar-menu-item>...</sng-layout-sidebar-menu-item>
 *     </sng-layout-sidebar-menu>
 *   </sng-layout-sidebar-group-content>
 * </sng-layout-sidebar-group>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-group-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngLayoutSidebarGroupContent {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('w-full text-sm', this.class())
  );
}
