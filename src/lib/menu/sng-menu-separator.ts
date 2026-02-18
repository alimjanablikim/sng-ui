import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Visual divider line between groups of menu items.
 *
 * @example
 * ```html
 * <sng-menu>
 *   <sng-menu-item>Undo</sng-menu-item>
 *   <sng-menu-item>Redo</sng-menu-item>
 *   <sng-menu-separator />
 *   <sng-menu-item>Cut</sng-menu-item>
 *   <sng-menu-item>Copy</sng-menu-item>
 * </sng-menu>
 * ```
 */
@Component({
  selector: 'sng-menu-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'block bg-border -mx-1 my-1 h-px',
    'role': 'separator',
  },
  template: '',
})
export class SngMenuSeparator {}
