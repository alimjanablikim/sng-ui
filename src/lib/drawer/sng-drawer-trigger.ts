import { Directive } from '@angular/core';

/**
 * Marker directive for drawer trigger elements.
 * Apply to buttons or other interactive elements that open the drawer.
 *
 * @example
 * ```html
 * <sng-drawer-trigger (click)="drawer.open(content)">
 *   Open Drawer
 * </sng-drawer-trigger>
 * ```
 */
@Directive({
  selector: 'sng-drawer-trigger',
  standalone: true,
  host: {
    'class': 'contents',
  },
})
export class SngDrawerTrigger {}
