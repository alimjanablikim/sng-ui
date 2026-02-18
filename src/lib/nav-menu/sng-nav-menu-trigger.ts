import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, inject, computed } from '@angular/core';
import { SngNavMenuItem } from './sng-nav-menu-item';
import { SngNavMenu, type SngNavMenuSide } from './sng-nav-menu';
import { cn } from './cn';

const CHEVRON_CLOSED: Record<SngNavMenuSide, string> = {
  bottom: '',
  top: 'rotate-180',
  right: '-rotate-90',
  left: 'rotate-90',
};

const CHEVRON_OPEN: Record<SngNavMenuSide, string> = {
  bottom: 'rotate-180',
  top: '',
  right: 'rotate-90',
  left: '-rotate-90',
};

/**
 * Button that triggers the display of navigation menu content.
 *
 * @example
 * ```html
 * <sng-nav-menu-item>
 *   <sng-nav-menu-trigger>Getting Started</sng-nav-menu-trigger>
 *   <sng-nav-menu-content>...</sng-nav-menu-content>
 * </sng-nav-menu-item>
 * ```
 */
@Component({
  selector: 'sng-nav-menu-trigger',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'contents',
  },
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [attr.data-state]="dataState()"
      aria-haspopup="menu"
      [attr.aria-expanded]="ariaExpanded()"
      (click)="onClick()"
    >
      <ng-content />
      <svg
        [class]="chevronClasses()"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </button>
  `,
})
export class SngNavMenuTrigger {
  /** Custom CSS classes. */
  class = input<string>('');

  private item = inject(SngNavMenuItem, { optional: true });
  private menu = inject(SngNavMenu, { optional: true });

  buttonClasses = computed(() =>
    cn(
      'group inline-flex h-9 w-max cursor-pointer items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium',
      'hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground',
      'focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px]',
      this.class()
    )
  );

  chevronClasses = computed(() => {
    const side = this.menu?.resolvedSide() ?? 'bottom';
    const isOpen = this.item?.isOpen() ?? false;
    return cn(
      'relative top-[1px] ml-1 h-3 w-3 transition duration-300',
      isOpen ? CHEVRON_OPEN[side] : CHEVRON_CLOSED[side]
    );
  });

  dataState = computed(() => this.item?.isOpen() ? 'open' : 'closed');

  ariaExpanded = computed(() => this.item?.isOpen() ?? false);

  onClick(): void {
    this.item?.toggle();
  }
}
