import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from './cn';

/**
 * Footer section of the sidebar, typically containing user info or actions.
 * Positioned at the bottom of the sidebar.
 *
 * @example
 * ```html
 * <sng-layout-sidebar>
 *   <sng-layout-sidebar-content>...</sng-layout-sidebar-content>
 *   <sng-layout-sidebar-footer>
 *     <img src="avatar.png" alt="User" />
 *     <span>John Doe</span>
 *   </sng-layout-sidebar-footer>
 * </sng-layout-sidebar>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .group[data-collapsible='icon'] sng-layout-sidebar-footer > button {
      width: 2rem !important;
      height: 2rem !important;
      padding: 0 !important;
    }
  `],
  template: `<ng-content />`,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngLayoutSidebarFooter {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn(
      'flex flex-col gap-2 p-2 overflow-hidden',
      // Icon mode: center content and auto-size buttons
      'group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:items-center',
      this.class()
    )
  );
}
