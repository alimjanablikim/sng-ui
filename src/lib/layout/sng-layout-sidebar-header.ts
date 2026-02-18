import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from './cn';

/**
 * Header section of the sidebar, typically containing logo or branding.
 * Positioned at the top of the sidebar.
 *
 * @example
 * ```html
 * <sng-layout-sidebar>
 *   <sng-layout-sidebar-header>
 *     <img src="logo.svg" alt="Logo" />
 *     <span>App Name</span>
 *   </sng-layout-sidebar-header>
 *   <sng-layout-sidebar-content>...</sng-layout-sidebar-content>
 * </sng-layout-sidebar>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .group[data-collapsible='icon'] sng-layout-sidebar-header > button {
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
export class SngLayoutSidebarHeader {
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
