import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Displays a shortcut hint aligned to the right side of a menu item.
 *
 * @example
 * ```html
 * <sng-menu>
 *   <sng-menu-item>
 *     Save
 *     <sng-menu-shortcut>Ctrl+S</sng-menu-shortcut>
 *   </sng-menu-item>
 * </sng-menu>
 * ```
 */
@Component({
  selector: 'sng-menu-shortcut',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ml-auto text-xs tracking-widest text-muted-foreground',
  },
  template: `<ng-content />`,
})
export class SngMenuShortcut {}
