import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * Container for nested sub-menu items within a parent menu item.
 * Displays a vertical line on the left to indicate hierarchy.
 *
 * @example
 * ```html
 * <sng-layout-sidebar-menu-item>
 *   <sng-layout-sidebar-menu-button>
 *     <span>Parent Item</span>
 *   </sng-layout-sidebar-menu-button>
 *   <sng-layout-sidebar-menu-sub>
 *     <sng-layout-sidebar-menu-sub-item>
 *       <sng-layout-sidebar-menu-sub-button routerLink="/child">Child</sng-layout-sidebar-menu-sub-button>
 *     </sng-layout-sidebar-menu-sub-item>
 *   </sng-layout-sidebar-menu-sub>
 * </sng-layout-sidebar-menu-item>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-menu-sub',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngLayoutSidebarMenuSub {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn(
      'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5',
      // Hide submenu when sidebar is collapsed to icon mode
      'group-data-[state=collapsed]:hidden',
      this.class()
    )
  );
}
