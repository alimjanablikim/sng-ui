import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
  computed,
  linkedSignal,
  InjectionToken,
  inject,
  input,
  booleanAttribute,
  afterNextRender,
  DestroyRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type LayoutSidebarDirection = 'ltr' | 'rtl';

export interface LayoutSidebarContext {
  state: () => 'expanded' | 'collapsed';
  open: () => boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  isMobile: () => boolean;
  openMobile: () => boolean;
  setOpenMobile: (open: boolean) => void;
  toggleMobile: () => void;
  direction: () => LayoutSidebarDirection;
  suppressTransition: () => boolean;
}

export const SNG_LAYOUT_SIDEBAR_CONTEXT = new InjectionToken<LayoutSidebarContext>('SNG_LAYOUT_SIDEBAR_CONTEXT');

/**
 * Provider component that manages sidebar state and responsive behavior.
 * Automatically switches between desktop (fixed/sticky sidebar) and mobile (drawer overlay)
 * at the 768px breakpoint via `matchMedia('(max-width: 767.98px)')`.
 *
 * Desktop and mobile have independent state: `open`/`toggle()` control the desktop sidebar,
 * `openMobile`/`toggleMobile()` control the mobile drawer. On mode switch, desktop state is
 * saved/restored and CSS transitions are suppressed to prevent flicker.
 *
 * To customize the breakpoint, change the `matchMedia` query in constructor and update
 * `md:` Tailwind prefixes in `SngLayoutSidebar` to match.
 *
 * @example
 * ```html
 * <sng-layout-sidebar-provider [defaultOpen]="true" sidebarWidth="20rem">
 *   <sng-layout-sidebar>
 *     <sng-layout-sidebar-content>Navigation</sng-layout-sidebar-content>
 *   </sng-layout-sidebar>
 *   <sng-layout-sidebar-inset>
 *     <sng-layout-sidebar-trigger />
 *     <main>Page content</main>
 *   </sng-layout-sidebar-inset>
 * </sng-layout-sidebar-provider>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-provider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styles: [`
    :host { --sidebar-width: 16rem; --sidebar-width-icon: 3rem; }
  `],
  host: {
    'class': 'group/sidebar-wrapper has-data-[layout=inset]:bg-sidebar flex min-h-svh w-full',
    '[style]': 'hostStyle()',
    '[attr.data-state]': 'state()',
    '[attr.dir]': 'direction()',
  },
  providers: [
    {
      provide: SNG_LAYOUT_SIDEBAR_CONTEXT,
      useFactory: () => {
        const provider = inject(SngLayoutSidebarProvider);
        return {
          state: provider.state,
          open: provider.open,
          setOpen: provider.setOpen.bind(provider),
          toggle: provider.toggle.bind(provider),
          isMobile: provider.isMobile,
          openMobile: provider.openMobile,
          setOpenMobile: provider.setOpenMobile.bind(provider),
          toggleMobile: provider.toggleMobile.bind(provider),
          direction: provider.direction,
          suppressTransition: provider.suppressTransition,
        };
      },
    },
  ],
})
export class SngLayoutSidebarProvider {
  /** Whether the sidebar is open by default. */
  defaultOpen = input(true, { transform: booleanAttribute });

  /** Text direction for the layout (LTR or RTL). */
  direction = input<LayoutSidebarDirection>('ltr');

  /** Sidebar width when expanded (CSS value). */
  sidebarWidth = input<string>('16rem');

  /** Sidebar width when collapsed to icons (CSS value). */
  sidebarWidthIcon = input<string>('3rem');

  private _open = linkedSignal(() => this.defaultOpen());
  private _isMobile = signal(false);
  private _openMobile = signal(false);
  private _suppressTransition = signal(false);
  private _desktopOpen: boolean | null = null;

  /** Whether the desktop sidebar is open. */
  open = this._open.asReadonly();

  /** Whether the viewport is below the mobile breakpoint (768px). */
  isMobile = this._isMobile.asReadonly();

  /** Whether the mobile drawer overlay is open. */
  openMobile = this._openMobile.asReadonly();

  /** True during desktop↔mobile mode switch; suppresses CSS transitions to prevent flicker. */
  suppressTransition = this._suppressTransition.asReadonly();

  state = computed(() => (this._open() ? 'expanded' : 'collapsed'));

  hostStyle = computed(() =>
    `--sidebar-width: ${this.sidebarWidth()}; --sidebar-width-icon: ${this.sidebarWidthIcon()}`
  );

  constructor() {
    const destroyRef = inject(DestroyRef);
    const cdr = inject(ChangeDetectorRef);
    const documentRef = inject(DOCUMENT);

    afterNextRender(() => {
      const view = documentRef.defaultView;
      if (!view?.matchMedia) {
        this._isMobile.set(false);
        return;
      }
      const mql = view.matchMedia('(max-width: 767.98px)');

      const handler = (e: MediaQueryListEvent | MediaQueryList) => {
        // Suppress CSS transitions during mode switch to prevent flicker
        this._suppressTransition.set(true);
        this._isMobile.set(e.matches);
        if (e.matches) {
          // Entering mobile: save desktop state, mobile drawer starts closed
          this._desktopOpen = this._open();
          this._openMobile.set(false);
        } else {
          // Entering desktop: close mobile drawer, restore saved desktop state
          this._openMobile.set(false);
          this._open.set(this._desktopOpen ?? this.defaultOpen());
          this._desktopOpen = null;
        }
        requestAnimationFrame(() => {
          this._suppressTransition.set(false);
          // Notify Angular's scheduler so zoneless CD picks up the change
          cdr.markForCheck();
        });
      };

      // Initial check — set isMobile without transition suppression since
      // there is no previous state to transition from on first render.
      this._isMobile.set(mql.matches);

      mql.addEventListener('change', handler);
      destroyRef.onDestroy(() => mql.removeEventListener('change', handler));
    });
  }

  setOpen(open: boolean): void {
    this._open.set(open);
  }

  toggle(): void {
    this._open.update(v => !v);
  }

  setOpenMobile(open: boolean): void {
    this._openMobile.set(open);
  }

  toggleMobile(): void {
    this._openMobile.update(v => !v);
  }
}
