import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * Groups related sidebar menu items together with optional label and action.
 * Use within `sng-layout-sidebar-content` to organize navigation sections.
 *
 * @example
 * ```html
 * <sng-layout-sidebar-group>
 *   <sng-layout-sidebar-group-label>Platform</sng-layout-sidebar-group-label>
 *   <sng-layout-sidebar-group-content>
 *     <sng-layout-sidebar-menu>
 *       <sng-layout-sidebar-menu-item>...</sng-layout-sidebar-menu-item>
 *     </sng-layout-sidebar-menu>
 *   </sng-layout-sidebar-group-content>
 * </sng-layout-sidebar-group>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngLayoutSidebarGroup {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('relative flex w-full min-w-0 flex-col p-2', this.class())
  );
}
