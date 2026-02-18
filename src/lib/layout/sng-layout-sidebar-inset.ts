import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * Container for the main content area that sits alongside the sidebar.
 * Adjusts its position based on the sidebar's collapsed state.
 *
 * @example
 * ```html
 * <sng-layout-sidebar-provider>
 *   <sng-layout-sidebar>...</sng-layout-sidebar>
 *   <sng-layout-sidebar-inset>
 *     <header>App header</header>
 *     <main>Main content</main>
 *   </sng-layout-sidebar-inset>
 * </sng-layout-sidebar-provider>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-inset',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngLayoutSidebarInset {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() =>
    cn(
      'bg-background relative flex w-full flex-1 flex-col',
      // Inset layout: card-like appearance with gap on all sides, rounded corners, border, shadow
      'md:peer-data-[layout=inset]:m-2 md:peer-data-[layout=inset]:rounded-xl md:peer-data-[layout=inset]:border md:peer-data-[layout=inset]:shadow-sm',
      this.class()
    )
  );
}
