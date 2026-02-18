import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  inject,
} from '@angular/core';
import { SngNavMenuItem } from './sng-nav-menu-item';
import { SngNavMenu, type SngNavMenuSide } from './sng-nav-menu';
import { cn } from './cn';

const SIDE_POSITION_CLASSES: Record<SngNavMenuSide, string> = {
  bottom: 'top-full left-0 mt-1.5',
  top: 'bottom-full left-0 mb-1.5',
  right: 'left-full top-0 ml-1.5',
  left: 'right-full top-0 mr-1.5',
};

/**
 * Dropdown content panel for navigation menu items.
 *
 * @example
 * ```html
 * <sng-nav-menu-item>
 *   <sng-nav-menu-trigger>Products</sng-nav-menu-trigger>
 *   <sng-nav-menu-content>
 *     <div class="grid gap-3 p-4 w-[400px]">
 *       <a sngNavMenuLink href="/products">All Products</a>
 *     </div>
 *   </sng-nav-menu-content>
 * </sng-nav-menu-item>
 * ```
 */
@Component({
  selector: 'sng-nav-menu-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .sng-nav-menu-panel[data-state=open] { animation: sng-nav-menu-enter 150ms ease both; }
    .sng-nav-menu-panel[data-state=closed] { animation: sng-nav-menu-exit 150ms ease both; }
    @keyframes sng-nav-menu-enter { from { opacity: 0; transform: scale(0.95); } }
    @keyframes sng-nav-menu-exit { to { opacity: 0; transform: scale(0.95); } }
  `],
  host: {
    'class': 'contents',
  },
  template: `
    @if (item.isOpen()) {
      <div [class]="panelClasses()" [attr.data-state]="'open'">
        <ng-content />
      </div>
    }
  `,
})
export class SngNavMenuContent {
  /** Custom CSS classes. */
  class = input<string>('');

  /** @internal */
  item = inject(SngNavMenuItem);
  private menu = inject(SngNavMenu);

  panelClasses = computed(() =>
    cn(
      'absolute z-50 rounded-md border bg-popover text-popover-foreground shadow-md p-2 sng-nav-menu-panel',
      SIDE_POSITION_CLASSES[this.menu.resolvedSide()],
      this.class()
    )
  );
}
