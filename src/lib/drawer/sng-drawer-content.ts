import {
  Component,
  input,
  computed,
  inject,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  AfterViewInit,
} from '@angular/core';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { SNG_DRAWER_INSTANCE, SNG_DRAWER_CLOSE, SngDrawerSide } from './sng-drawer';
import { cn } from './cn';

/**
 * Container for the drawer panel content.
 * Uses CDK focus trap for accessibility and supports slide animations.
 *
 * @example
 * ```html
 * <ng-template #content>
 *   <sng-drawer-content>
 *     <sng-drawer-handle></sng-drawer-handle>
 *     <sng-drawer-header>
 *       <sng-drawer-title>Settings</sng-drawer-title>
 *     </sng-drawer-header>
 *     <div class="p-4">Drawer content</div>
 *   </sng-drawer-content>
 * </ng-template>
 * ```
 */
@Component({
  selector: 'sng-drawer-content',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  hostDirectives: [CdkTrapFocus],
  host: {
    role: 'dialog',
    'aria-modal': 'true',
  },
  styles: [`
    sng-drawer-content {
      display: contents;
    }
    /* Overlay fade */
    .sng-drawer-overlay[data-state=open] { animation: sng-drawer-fade-in var(--sng-drawer-duration, 300ms) var(--sng-drawer-ease, ease) both; }
    .sng-drawer-overlay[data-state=closed] { animation: sng-drawer-fade-out var(--sng-drawer-duration, 300ms) var(--sng-drawer-ease, ease) both; }
    @keyframes sng-drawer-fade-in { from { opacity: 0; } }
    @keyframes sng-drawer-fade-out { to { opacity: 0; } }
    /* Content slide per side */
    .sng-drawer-panel[data-state=open][data-side=top] { animation: sng-drawer-in-top var(--sng-drawer-duration, 300ms) var(--sng-drawer-ease, ease) both; }
    .sng-drawer-panel[data-state=closed][data-side=top] { animation: sng-drawer-out-top var(--sng-drawer-duration, 300ms) var(--sng-drawer-ease, ease) both; }
    .sng-drawer-panel[data-state=open][data-side=bottom] { animation: sng-drawer-in-bottom var(--sng-drawer-duration, 300ms) var(--sng-drawer-ease, ease) both; }
    .sng-drawer-panel[data-state=closed][data-side=bottom] { animation: sng-drawer-out-bottom var(--sng-drawer-duration, 300ms) var(--sng-drawer-ease, ease) both; }
    .sng-drawer-panel[data-state=open][data-side=left] { animation: sng-drawer-in-left var(--sng-drawer-duration, 300ms) var(--sng-drawer-ease, ease) both; }
    .sng-drawer-panel[data-state=closed][data-side=left] { animation: sng-drawer-out-left var(--sng-drawer-duration, 300ms) var(--sng-drawer-ease, ease) both; }
    .sng-drawer-panel[data-state=open][data-side=right] { animation: sng-drawer-in-right var(--sng-drawer-duration, 300ms) var(--sng-drawer-ease, ease) both; }
    .sng-drawer-panel[data-state=closed][data-side=right] { animation: sng-drawer-out-right var(--sng-drawer-duration, 300ms) var(--sng-drawer-ease, ease) both; }
    @keyframes sng-drawer-in-top { from { transform: translateY(-100%); } }
    @keyframes sng-drawer-out-top { to { transform: translateY(-100%); } }
    @keyframes sng-drawer-in-bottom { from { transform: translateY(100%); } }
    @keyframes sng-drawer-out-bottom { to { transform: translateY(100%); } }
    @keyframes sng-drawer-in-left { from { transform: translateX(-100%); } }
    @keyframes sng-drawer-out-left { to { transform: translateX(-100%); } }
    @keyframes sng-drawer-in-right { from { transform: translateX(100%); } }
    @keyframes sng-drawer-out-right { to { transform: translateX(100%); } }
  `],
  template: `
    <!-- Backdrop overlay (decorative) -->
    <div
      aria-hidden="true"
      [class]="overlayClasses()"
      [attr.data-state]="state()"
      (click)="onOverlayClick()"
    ></div>

    <!-- Drawer content panel -->
    <div
      [class]="contentClasses()"
      [attr.data-state]="state()"
      [attr.data-side]="side()"
      role="document"
    >
      <ng-content />
    </div>
  `,
})
export class SngDrawerContent implements AfterViewInit {
  private drawer = inject(SNG_DRAWER_INSTANCE, { optional: true });
  private closeFn = inject(SNG_DRAWER_CLOSE, { optional: true });
  private focusTrap = inject(CdkTrapFocus);

  /** Custom CSS classes. */
  class = input<string>('');

  ngAfterViewInit(): void {
    // Auto-focus the first tabbable element
    this.focusTrap.focusTrap.focusInitialElementWhenReady();
  }

  /** @internal Side for data-side attribute binding */
  side = computed(() => this.drawer?.side() ?? 'bottom');
  private isModal = computed(() => this.drawer?.modal() ?? false);
  state = computed(() => this.drawer?.isOpen() ? 'open' : 'closed');

  onOverlayClick(): void {
    this.closeFn?.();
  }

  overlayClasses = computed(() =>
    cn(
      'fixed inset-0 z-50 sng-drawer-overlay',
      // Modal mode uses darker backdrop like Sheet, regular drawer uses light backdrop
      this.isModal() ? 'bg-black/50' : 'bg-black/8',
    )
  );

  // Side-specific positioning (layout only, animations handled by CSS keyframes)
  // Note: No max-w constraint so user can override with custom width via class input
  private sideClasses: Record<SngDrawerSide, string> = {
    top: 'inset-x-0 top-0 max-h-[80vh] rounded-b-lg border-b',
    bottom: 'inset-x-0 bottom-0 max-h-[80vh] rounded-t-lg border-t',
    left: 'inset-y-0 left-0 h-full w-full sm:w-3/4 border-r',
    right: 'inset-y-0 right-0 h-full w-full sm:w-3/4 border-l',
  };

  contentClasses = computed(() =>
    cn(
      'fixed z-50 flex flex-col bg-background shadow-lg sng-drawer-panel',
      this.sideClasses[this.side()],
      this.class()
    )
  );
}
