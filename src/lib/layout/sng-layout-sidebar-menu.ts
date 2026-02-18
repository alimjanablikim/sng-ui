import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * Container for sidebar menu items, providing proper layout and spacing.
 * Place menu items inside this component.
 *
 * @example
 * ```html
 * <sng-layout-sidebar-menu>
 *   <sng-layout-sidebar-menu-item>
 *     <sng-layout-sidebar-menu-button routerLink="/dashboard">
 *       <lucide-icon name="home" />
 *       <span>Dashboard</span>
 *     </sng-layout-sidebar-menu-button>
 *   </sng-layout-sidebar-menu-item>
 * </sng-layout-sidebar-menu>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngLayoutSidebarMenu {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn('flex w-full min-w-0 flex-col gap-1', this.class())
  );
}
