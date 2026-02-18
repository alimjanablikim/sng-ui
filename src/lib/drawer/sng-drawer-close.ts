import { Directive, inject } from '@angular/core';
import { SNG_DRAWER_CLOSE } from './sng-drawer';

/**
 * Directive that closes the drawer when clicked.
 * Use as an element wrapper around any clickable content.
 *
 * @example
 * ```html
 * <sng-drawer-close>
 *   <sng-button class="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90">Save</sng-button>
 * </sng-drawer-close>
 * ```
 */
@Directive({
  selector: 'sng-drawer-close',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class SngDrawerClose {
  private closeFn = inject(SNG_DRAWER_CLOSE, { optional: true });

  onClick() {
    this.closeFn?.();
  }
}
