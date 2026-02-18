import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * Individual item container within a sidebar sub-menu.
 * Contains a sub-button for navigation.
 *
 * @example
 * ```html
 * <sng-layout-sidebar-menu-sub>
 *   <sng-layout-sidebar-menu-sub-item>
 *     <sng-layout-sidebar-menu-sub-button routerLink="/overview" [isActive]="true">
 *       <span>Overview</span>
 *     </sng-layout-sidebar-menu-sub-button>
 *   </sng-layout-sidebar-menu-sub-item>
 * </sng-layout-sidebar-menu-sub>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-menu-sub-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngLayoutSidebarMenuSubItem {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() => cn('block w-full', this.class()));
}
