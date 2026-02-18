import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewEncapsulation,
  DestroyRef,
  input,
  computed,
  inject,
  effect,
  afterNextRender,
  DOCUMENT,
} from '@angular/core';
import { SNG_LAYOUT_SIDEBAR_CONTEXT } from './sng-layout-sidebar-provider';
import { cn } from './cn';

export type LayoutSidebarSide = 'left' | 'right';
export type LayoutSidebarCollapsible = 'offcanvas' | 'icon' | 'none';
export type LayoutSidebarLayout = 'sidebar' | 'floating' | 'inset';

/**
 * Main sidebar component that renders as a fixed/sticky panel on desktop (≥768px) or a
 * drawer overlay on mobile (<768px). The dual rendering is automatic — the same template
 * switches between `containerClasses()` (desktop) and `mobileDrawerClasses()` (mobile)
 * based on `context.isMobile()`.
 *
 * On mobile: renders a fixed drawer with slide animation, backdrop overlay, body scroll
 * lock. On desktop: renders a fixed/sticky panel with configurable
 * `layout` and `collapsible` modes.
 *
 * To customize the mobile breakpoint, change the `matchMedia` query in the provider and
 * update the `md:` Tailwind prefixes in this component (hostClasses, containerClasses).
 *
 * @example
 * ```html
 * <sng-layout-sidebar-provider>
 *   <sng-layout-sidebar side="left" collapsible="icon">
 *     <sng-layout-sidebar-header>Logo</sng-layout-sidebar-header>
 *     <sng-layout-sidebar-content>
 *       <sng-layout-sidebar-menu>...</sng-layout-sidebar-menu>
 *     </sng-layout-sidebar-content>
 *     <sng-layout-sidebar-footer>User</sng-layout-sidebar-footer>
 *   </sng-layout-sidebar>
 *   <sng-layout-sidebar-inset>Main content</sng-layout-sidebar-inset>
 * </sng-layout-sidebar-provider>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: `
    /* Remap accent colors to sidebar-accent for menus inside sidebar */
    sng-layout-sidebar {
      --accent: var(--sidebar-accent);
      --accent-foreground: var(--sidebar-accent-foreground);
      /* Darker variant for selected/active state - light mode: darken, dark mode: lighten */
      --sidebar-active: color-mix(in oklch, var(--sidebar-accent), black 8%);
    }
    /* Dark mode: lighten instead of darken */
    .dark sng-layout-sidebar {
      --sidebar-active: color-mix(in oklch, var(--sidebar-accent), white 15%);
    }

    /* Mobile overlay animations */
    .sng-sidebar-overlay[data-state=open] { animation: sng-sidebar-overlay-in 200ms ease both; }
    .sng-sidebar-overlay[data-state=closed] { animation: sng-sidebar-overlay-out 200ms ease both; }
    @keyframes sng-sidebar-overlay-in { from { opacity: 0; } }
    @keyframes sng-sidebar-overlay-out { to { opacity: 0; } }

    /* Mobile drawer slide animations */
    .sng-sidebar-drawer[data-state=open][data-side=left] { animation: sng-sidebar-slide-in-left 200ms ease both; }
    .sng-sidebar-drawer[data-state=closed][data-side=left] { animation: sng-sidebar-slide-out-left 200ms ease both; }
    .sng-sidebar-drawer[data-state=open][data-side=right] { animation: sng-sidebar-slide-in-right 200ms ease both; }
    .sng-sidebar-drawer[data-state=closed][data-side=right] { animation: sng-sidebar-slide-out-right 200ms ease both; }
    @keyframes sng-sidebar-slide-in-left { from { transform: translateX(-100%); } }
    @keyframes sng-sidebar-slide-out-left { to { transform: translateX(-100%); } }
    @keyframes sng-sidebar-slide-in-right { from { transform: translateX(100%); } }
    @keyframes sng-sidebar-slide-out-right { to { transform: translateX(100%); } }
  `,
  template: `
    <!-- Mobile overlay backdrop (only rendered on mobile after first open) -->
    @if (context.isMobile() && hasBeenOpened()) {
      <button type="button"
              class="sng-sidebar-overlay fixed inset-0 z-50 appearance-none border-0 bg-black/50 p-0"
              [class.pointer-events-none]="!context.openMobile()"
              [attr.data-state]="mobileState()"
              [attr.tabindex]="context.openMobile() ? 0 : -1"
              [attr.aria-label]="'Close sidebar'"
              (click)="onBackdropClick()"></button>
    }

    <!-- Desktop gap div (reserves space in document flow) -->
    @if (!context.isMobile()) {
      <div [class]="gapClasses()"></div>
    }

    <!-- Shared container: switches between desktop fixed and mobile drawer -->
    <div [class]="context.isMobile() ? mobileDrawerClasses() : containerClasses()"
         [attr.data-state]="context.isMobile() ? mobileState() : context.state()"
         [attr.data-collapsible]="context.isMobile() ? null : collapsibleAttr()"
         [attr.data-side]="context.isMobile() ? side() : null"
         [class.pointer-events-none]="context.isMobile() && !context.openMobile()"
         [attr.aria-hidden]="context.isMobile() && !context.openMobile() ? 'true' : null"
         [attr.inert]="context.isMobile() && !context.openMobile() ? '' : null">
      <div [class]="innerClasses()"
           [attr.data-state]="context.isMobile() ? null : context.state()"
           [attr.data-collapsible]="context.isMobile() ? null : collapsibleAttr()">
        <ng-content />
      </div>
    </div>
  `,
  host: {
    // Static fallback prevents FOUC with zoneless CD (dynamic [class] may not flush immediately)
    'class': 'group peer text-sidebar-foreground hidden md:block',
    '[class]': 'hostClasses()',
    '[style.display]': 'hostDisplay()',
    '[attr.data-state]': 'context.isMobile() ? mobileState() : context.state()',
    '[attr.data-collapsible]': 'collapsibleAttr()',
    '[attr.data-side]': 'side()',
    '[attr.data-layout]': 'layout()',
  },
})
export class SngLayoutSidebar {
  /** Which side of the viewport the sidebar appears on. */
  side = input<LayoutSidebarSide>('left');

  /** Collapse behavior: 'offcanvas' slides out, 'icon' shows icons only, 'none' disables collapse. */
  collapsible = input<LayoutSidebarCollapsible>('offcanvas');

  /**
   * Layout mode controlling positioning and visual style.
   * - 'sidebar': Fixed positioning with border (default)
   * - 'floating': Fixed with padding, rounded corners, border, and shadow
   * - 'inset': Sticky positioning within content flow
   */
  layout = input<LayoutSidebarLayout>('sidebar');

  /** Custom CSS classes. */
  class = input<string>('');

  protected context = inject(SNG_LAYOUT_SIDEBAR_CONTEXT);
  private doc = inject(DOCUMENT);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  // data-collapsible only shows value when collapsed
  collapsibleAttr = computed(() =>
    this.context.state() === 'collapsed' ? this.collapsible() : ''
  );

  // Mobile drawer state
  mobileState = computed(() =>
    this.context.openMobile() ? 'open' : 'closed'
  );

  // Track if mobile drawer has ever been opened (avoid rendering closed drawer on page load)
  private _hasBeenOpened = false;
  hasBeenOpened = computed(() => {
    if (this.context.openMobile()) this._hasBeenOpened = true;
    return this._hasBeenOpened;
  });

  // Host element - outer wrapper
  hostClasses = computed(() => cn(
    'group peer text-sidebar-foreground',
    this.class()
  ));

  hostDisplay = computed(() => (this.context.isMobile() ? 'block' : null));

  // Gap div - reserves space in document flow (desktop only)
  gapClasses = computed(() => {
    const s = this.side();
    const v = this.layout();
    const noTransition = this.context.suppressTransition();
    return cn(
      'relative bg-transparent',
      !noTransition && 'transition-[width] duration-200 ease-linear',
      'w-(--sidebar-width)',
      'group-data-[collapsible=offcanvas]:w-0',
      v === 'floating'
        ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem)]'
        : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
      s === 'right' && 'order-1'
    );
  });

  // Container - positions the sidebar based on layout mode (desktop only)
  containerClasses = computed(() => {
    const s = this.side();
    const v = this.layout();
    const isInset = v === 'inset';
    const noTransition = this.context.suppressTransition();

    return cn(
      'z-10 hidden w-(--sidebar-width) md:flex',
      !noTransition && 'transition-[inset-inline-start,inset-inline-end,width] duration-200 ease-linear',
      isInset ? 'sticky top-0 h-svh' : 'fixed inset-y-0 h-full',
      !isInset && (s === 'left' ? 'start-0' : 'end-0'),
      v === 'floating' && 'p-2',
      isInset
        ? 'group-data-[collapsible=offcanvas]:w-0'
        : s === 'left'
          ? 'group-data-[collapsible=offcanvas]:start-[calc(var(--sidebar-width)*-1)]'
          : 'group-data-[collapsible=offcanvas]:end-[calc(var(--sidebar-width)*-1)]',
      v === 'floating'
        ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem+2px)]'
        : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
      v === 'sidebar' && (s === 'left' ? 'border-e' : 'border-s')
    );
  });

  // Mobile drawer classes
  mobileDrawerClasses = computed(() => {
    const s = this.side();
    return cn(
      'sng-sidebar-drawer fixed inset-y-0 z-50 flex w-(--sidebar-width) shadow-lg',
      s === 'left' ? 'left-0 border-e' : 'right-0 border-s',
      // Before first open, hide offscreen to avoid flash
      !this.hasBeenOpened() && (s === 'left' ? '-translate-x-full' : 'translate-x-full')
    );
  });

  // Inner div - actual sidebar content
  innerClasses = computed(() => {
    const v = this.layout();
    return cn(
      'group flex h-full w-full flex-col bg-sidebar',
      !this.context.isMobile() && v === 'floating' && 'rounded-lg border border-sidebar-border shadow-sm'
    );
  });

  constructor() {
    // Ensure all template bindings are flushed after first render (zoneless CD fix)
    afterNextRender(() => this.cdr.detectChanges());

    // Body scroll lock when mobile drawer is open
    effect(() => {
      const isOpen = this.context.isMobile() && this.context.openMobile();
      this.doc.body.style.overflow = isOpen ? 'hidden' : '';
    });

    this.destroyRef.onDestroy(() => {
      this.doc.body.style.overflow = '';
    });
  }

  protected onBackdropClick(): void {
    this.context.setOpenMobile(false);
  }

}
