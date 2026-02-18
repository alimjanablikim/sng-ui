import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * Individual menu item container within a sidebar menu.
 * Contains a menu button and optionally a badge or action.
 *
 * @example
 * ```html
 * <sng-layout-sidebar-menu-item>
 *   <sng-layout-sidebar-menu-button routerLink="/inbox" [isActive]="true">
 *     <lucide-icon name="inbox" />
 *     <span>Inbox</span>
 *   </sng-layout-sidebar-menu-button>
 *   <sng-layout-sidebar-menu-badge>24</sng-layout-sidebar-menu-badge>
 * </sng-layout-sidebar-menu-item>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-menu-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngLayoutSidebarMenuItem {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('group/menu-item relative block w-full overflow-hidden', this.class())
  );
}
