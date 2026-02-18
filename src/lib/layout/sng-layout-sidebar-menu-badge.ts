import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * Badge component displaying a count or status indicator on a menu item.
 * Positioned on the right side of the menu button.
 *
 * @example
 * ```html
 * <sng-layout-sidebar-menu-item>
 *   <sng-layout-sidebar-menu-button routerLink="/notifications">
 *     <lucide-icon name="bell" />
 *     <span>Notifications</span>
 *   </sng-layout-sidebar-menu-button>
 *   <sng-layout-sidebar-menu-badge>5</sng-layout-sidebar-menu-badge>
 * </sng-layout-sidebar-menu-item>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-menu-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngLayoutSidebarMenuBadge {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn(
      'text-sidebar-foreground pointer-events-none absolute right-1 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none',
      'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
      'peer-data-[size=sm]/menu-button:top-1',
      'peer-data-[size=lg]/menu-button:top-2.5',
      'group-data-[collapsible=icon]:hidden',
      this.class()
    )
  );
}
