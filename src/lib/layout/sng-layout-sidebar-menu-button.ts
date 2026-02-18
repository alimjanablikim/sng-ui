import {
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  Component,
  booleanAttribute,
  inject,
  viewChild,
  ElementRef,
  effect,
} from '@angular/core';
import { Router } from '@angular/router';
import { cn } from './cn';

export type LayoutSidebarMenuButtonSize = 'sm' | 'default' | 'lg';

const sizeClasses: Record<LayoutSidebarMenuButtonSize, string> = {
  sm: 'h-7 text-xs',
  default: 'h-8 text-sm',
  lg: 'h-12 text-sm',
};

/**
 * Interactive button or link within a sidebar menu item.
 * Supports multiple sizes and active state styling.
 * Renders as anchor when href is provided, otherwise as button.
 *
 * @example
 * ```html
 * <!-- As a link -->
 * <sng-layout-sidebar-menu-button href="/settings" [isActive]="isSettingsActive">
 *   <lucide-icon name="settings" />
 *   <span>Settings</span>
 * </sng-layout-sidebar-menu-button>
 *
 * <!-- As a button with size -->
 * <sng-layout-sidebar-menu-button size="lg" (click)="openDialog()">
 *   <lucide-icon name="plus" />
 *   <span>New Project</span>
 * </sng-layout-sidebar-menu-button>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-menu-button',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    sng-layout-sidebar-menu-button a sng-icon,
    sng-layout-sidebar-menu-button button sng-icon {
      width: 1rem;
      height: 1rem;
      flex: 0 0 1rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    sng-layout-sidebar-menu-button a svg,
    sng-layout-sidebar-menu-button button svg {
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
    }
    sng-layout-sidebar[data-collapsible='icon'] sng-layout-sidebar-menu-button a,
    sng-layout-sidebar[data-collapsible='icon'] sng-layout-sidebar-menu-button button {
      justify-content: center;
      gap: 0;
    }
    sng-layout-sidebar[data-collapsible='icon'] sng-layout-sidebar-menu-button a > span > :not(:first-child),
    sng-layout-sidebar[data-collapsible='icon'] sng-layout-sidebar-menu-button button > span > :not(:first-child) {
      display: none !important;
    }
  `],
  host: {
    'class': 'contents',
  },
  template: `
    <button
      type="button"
      [class]="hostClasses()"
      [disabled]="disabled()"
      [attr.data-active]="isActive() || null"
      [attr.data-size]="sizeAttr()"
      [style.display]="safeHref() ? 'none' : null"
      (click)="onButtonClick($event)"
    >
      <span #contentContainer style="display: contents">
        <ng-content />
      </span>
    </button>

    <a
      [attr.href]="disabled() ? null : safeHref()"
      [class]="hostClasses()"
      [attr.aria-disabled]="disabled() ? 'true' : null"
      [attr.tabindex]="disabled() ? '-1' : null"
      [attr.data-active]="isActive() || null"
      [attr.data-size]="sizeAttr()"
      [style.display]="safeHref() ? null : 'none'"
      (click)="onAnchorClick($event)"
    >
      <span #anchorContentTarget style="display: contents"></span>
    </a>
  `,
})
export class SngLayoutSidebarMenuButton {
  /** Angular router target. When provided, button click navigates through Angular Router. */
  routerLink = input<string | unknown[]>();

  /** URL for link navigation. When provided, renders as anchor. */
  href = input<string>();

  /**
   * Whether the menu button is in an active/selected state.
   */
  isActive = input(false, { transform: booleanAttribute });

  /** Whether the button is disabled (only applies when not using href). */
  disabled = input(false, { transform: booleanAttribute });

  /**
   * Size of the menu button. Affects height and font size.
   */
  size = input<LayoutSidebarMenuButtonSize>('default');

  /** Custom CSS classes. */
  class = input<string>('');

  private router = inject(Router);
  private contentContainer = viewChild<ElementRef>('contentContainer');
  private anchorContentTarget = viewChild<ElementRef>('anchorContentTarget');

  constructor() {
    // Keep projected content when switching between button and anchor rendering.
    effect(() => {
      const container = this.contentContainer()?.nativeElement;
      const target = this.anchorContentTarget()?.nativeElement;
      if (!container || !target) {
        return;
      }

      if (this.safeHref()) {
        while (container.firstChild) {
          target.appendChild(container.firstChild);
        }
        return;
      }

      while (target.firstChild) {
        container.appendChild(target.firstChild);
      }
    });
  }

  /** @internal */
  protected sizeAttr = computed(() => this.size());
  protected safeHref = computed(() => {
    const value = this.href()?.trim();
    if (!value || value.toLowerCase().startsWith('javascript:')) {
      return null;
    }
    return value;
  });

  hostClasses = computed(() =>
    cn(
      'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring select-none cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-(--sidebar-active) data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground',
      // Collapsed state - force 32px square; lg buttons need no padding so 32px icons/avatars fit
      'group-data-[collapsible=icon]:!size-8',
      this.size() === 'lg'
        ? 'group-data-[collapsible=icon]:!p-0'
        : 'group-data-[collapsible=icon]:!p-2',
      sizeClasses[this.size()],
      this.class()
    )
  );

  protected onAnchorClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  protected onButtonClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const linkTarget = this.routerLink();
    if (!linkTarget) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    if (Array.isArray(linkTarget)) {
      void this.router.navigate(linkTarget);
    } else {
      void this.router.navigateByUrl(linkTarget);
    }
  }
}
