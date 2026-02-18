import { Component, ChangeDetectionStrategy, input, inject, computed } from '@angular/core';
import { SngNavMenu } from './sng-nav-menu';
import { cn } from './cn';

/**
 * Container for navigation menu items.
 *
 * @example
 * ```html
 * <sng-nav-menu>
 *   <sng-nav-menu-list>
 *     <sng-nav-menu-item>
 *       <sng-nav-menu-trigger>Getting Started</sng-nav-menu-trigger>
 *       <sng-nav-menu-content>...</sng-nav-menu-content>
 *     </sng-nav-menu-item>
 *   </sng-nav-menu-list>
 * </sng-nav-menu>
 * ```
 */
@Component({
  selector: 'sng-nav-menu-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngNavMenuList {
  /** Custom CSS classes. */
  class = input<string>('');

  private menu = inject(SngNavMenu, { optional: true });

  hostClasses = computed(() => {
    const isVertical = this.menu?.layout() === 'vertical';
    return cn(
      'relative group flex flex-1 list-none items-center',
      isVertical ? 'flex-col space-y-1' : 'justify-center space-x-1',
      this.class()
    );
  });
}
