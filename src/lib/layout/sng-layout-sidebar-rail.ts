import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  inject,
} from '@angular/core';
import { SNG_LAYOUT_SIDEBAR_CONTEXT } from './sng-layout-sidebar-provider';
import { cn } from './cn';

/**
 * Thin clickable rail at the sidebar edge for toggling. Hidden on mobile (drawer mode
 * uses backdrop click and escape instead). Calls `toggle()` on desktop, `toggleMobile()`
 * on mobile.
 *
 * @example
 * ```html
 * <sng-layout-sidebar>
 *   <sng-layout-sidebar-content>Navigation</sng-layout-sidebar-content>
 *   <sng-layout-sidebar-rail />
 * </sng-layout-sidebar>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-rail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    '[class]': 'hostClasses()',
    '[attr.aria-label]': 'toggleLabel()',
    'tabindex': '-1',
    '(click)': 'onClick()',
  },
})
export class SngLayoutSidebarRail {
  /** Custom CSS classes. */
  class = input<string>('');

  /** Accessible label for the rail toggle control. */
  toggleLabel = input<string>('Toggle Sidebar');

  private context = inject(SNG_LAYOUT_SIDEBAR_CONTEXT);

  hostClasses = computed(() =>
    cn(
      'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 cursor-pointer transition-colors ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex',
      this.context.isMobile() && '!hidden',
      this.class()
    )
  );

  onClick(): void {
    if (this.context.isMobile()) {
      this.context.toggleMobile();
    } else {
      this.context.toggle();
    }
  }
}
