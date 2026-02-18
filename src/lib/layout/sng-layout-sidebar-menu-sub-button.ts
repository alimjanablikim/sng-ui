import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  booleanAttribute,
  inject,
  viewChild,
  ElementRef,
  effect,
} from '@angular/core';
import { Router } from '@angular/router';
import { cn } from './cn';

/**
 * Interactive button or link within a sidebar sub-menu item.
 * Smaller than the main menu button, designed for nested navigation.
 * Renders as anchor when href is provided, otherwise as button.
 *
 * @example
 * ```html
 * <!-- As a link -->
 * <sng-layout-sidebar-menu-sub-button href="/settings/profile" [isActive]="true">
 *   <span>Profile</span>
 * </sng-layout-sidebar-menu-sub-button>
 *
 * <!-- As a button -->
 * <sng-layout-sidebar-menu-sub-button (click)="selectItem()">
 *   <span>Select</span>
 * </sng-layout-sidebar-menu-sub-button>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-menu-sub-button',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    sng-layout-sidebar-menu-sub-button a svg,
    sng-layout-sidebar-menu-sub-button button svg {
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
      color: hsl(var(--sidebar-accent-foreground));
    }
    sng-layout-sidebar-menu-sub-button a span:last-child,
    sng-layout-sidebar-menu-sub-button button span:last-child {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
      [style.display]="safeHref() ? null : 'none'"
      (click)="onAnchorClick($event)"
    >
      <span #anchorContentTarget style="display: contents"></span>
    </a>
  `,
})
export class SngLayoutSidebarMenuSubButton {
  /** Angular router target. When provided, button click navigates through Angular Router. */
  routerLink = input<string | unknown[]>();

  /** URL for link navigation. When provided, renders as anchor. */
  href = input<string>();

  /**
   * Whether the sub-button is in an active/selected state.
   */
  isActive = input(false, { transform: booleanAttribute });

  /** Whether the button is disabled (only applies when not using href). */
  disabled = input(false, { transform: booleanAttribute });

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

  protected safeHref = computed(() => {
    const value = this.href()?.trim();
    if (!value || value.toLowerCase().startsWith('javascript:')) {
      return null;
    }
    return value;
  });

  hostClasses = computed(() =>
    cn(
      'flex w-full h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-(--sidebar-active) data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground text-xs',
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
