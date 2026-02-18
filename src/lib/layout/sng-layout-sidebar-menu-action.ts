import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  booleanAttribute,
} from '@angular/core';
import { cn } from './cn';

/**
 * Action button that appears on the right side of a menu item.
 * Can be configured to show only on hover for a cleaner appearance.
 *
 * @example
 * ```html
 * <sng-layout-sidebar-menu-item>
 *   <sng-layout-sidebar-menu-button routerLink="/project">
 *     <span>Project</span>
 *   </sng-layout-sidebar-menu-button>
 *   <sng-layout-sidebar-menu-action [showOnHover]="true" (click)="openMenu()">
 *     <lucide-icon name="more-horizontal" />
 *   </sng-layout-sidebar-menu-action>
 * </sng-layout-sidebar-menu-item>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-menu-action',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    sng-layout-sidebar-menu-action > button > svg {
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
    }
  `],
  host: {
    'class': 'contents',
  },
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled()"
      [attr.data-state]="dataState()"
    >
      <ng-content />
    </button>
  `,
})
export class SngLayoutSidebarMenuAction {
  /** Custom CSS classes. */
  class = input<string>('');

  /** Whether the button is disabled. */
  disabled = input(false, { transform: booleanAttribute });

  /**
   * When true, the action button is hidden until the menu item is hovered.
   */
  showOnHover = input(false, { transform: booleanAttribute });

  /**
   * Data state attribute for styling purposes (e.g., 'open' when menu is open).
   */
  dataState = input<string>();

  buttonClasses = computed(() =>
    cn(
      'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2',
      // Increases the hit area of the button on mobile
      'after:absolute after:-inset-2 md:after:hidden',
      'peer-data-[size=sm]/menu-button:top-1',
      'peer-data-[size=default]/menu-button:top-1.5',
      'peer-data-[size=lg]/menu-button:top-2.5',
      'group-data-[collapsible=icon]:hidden',
      this.showOnHover() &&
        'peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0',
      this.class()
    )
  );
}
