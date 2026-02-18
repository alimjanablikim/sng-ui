import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  inject,
  AfterViewInit,
} from '@angular/core';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { SNG_DIALOG_INSTANCE } from './sng-dialog';
import { cn } from './cn';

/**
 * Dialog content panel that renders inside a CDK overlay.
 * Provides focus trapping, backdrop overlay, and animated transitions.
 *
 * @example
 * ```html
 * <sng-dialog-content>
 *   <sng-dialog-close />
 *   <sng-dialog-header>
 *     <sng-dialog-title>Edit Profile</sng-dialog-title>
 *     <sng-dialog-description>Make changes to your profile here.</sng-dialog-description>
 *   </sng-dialog-header>
 *   <div class="py-4">Dialog body content here.</div>
 *   <sng-dialog-footer>
 *     <sng-button class="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90" (click)="dialog.close()">Save</sng-button>
 *   </sng-dialog-footer>
 * </sng-dialog-content>
 * ```
 */
@Component({
  selector: 'sng-dialog-content',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  hostDirectives: [CdkTrapFocus],
  host: {
    '[attr.role]': 'dialogRole()',
    'aria-modal': 'true',
  },
  template: `
    <!-- Overlay (decorative backdrop) -->
    <div
      aria-hidden="true"
      [class]="overlayClasses()"
      [attr.data-state]="state()"
      (click)="onOverlayClick($event)"
    ></div>

    <!-- Centered container -->
    <div class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <!-- Content -->
      <div
        [class]="contentClasses()"
        [attr.data-state]="state()"
        role="document"
      >
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    sng-dialog-content {
      display: contents;
    }
    .sng-dialog-overlay[data-state=open] { animation: sng-dialog-fade-in var(--sng-dialog-duration, 200ms) var(--sng-dialog-ease, ease) both; }
    .sng-dialog-overlay[data-state=closed] { animation: sng-dialog-fade-out var(--sng-dialog-duration, 200ms) var(--sng-dialog-ease, ease) both; }
    .sng-dialog-panel[data-state=open] { animation: sng-dialog-enter var(--sng-dialog-duration, 200ms) var(--sng-dialog-ease, ease) both; }
    .sng-dialog-panel[data-state=closed] { animation: sng-dialog-exit var(--sng-dialog-duration, 200ms) var(--sng-dialog-ease, ease) both; }
    @keyframes sng-dialog-fade-in { from { opacity: 0; } }
    @keyframes sng-dialog-fade-out { to { opacity: 0; } }
    @keyframes sng-dialog-enter { from { opacity: 0; transform: scale(0.95); } }
    @keyframes sng-dialog-exit { to { opacity: 0; transform: scale(0.95); } }
  `],
})
export class SngDialogContent implements AfterViewInit {
  private dialog = inject(SNG_DIALOG_INSTANCE, { optional: true });
  private focusTrap = inject(CdkTrapFocus);

  /** Custom CSS classes. */
  class = input<string>('');

  /** @internal Tracks whether dialog has been opened, to prevent initial data-state="closed". */
  private _hasOpened = false;

  ngAfterViewInit(): void {
    // Auto-focus the first tabbable element
    this.focusTrap.focusTrap.focusInitialElementWhenReady();
    // Mark as initialized so future closes return 'closed' for exit animation.
    this._hasOpened = true;
  }

  /**
   * Returns the dialog state for `data-state` attribute binding.
   * - Before first open: `undefined` (no attribute) — lets elements enter DOM clean
   *   so the enter animation triggers on a fresh element without a prior exit animation.
   * - When open: `'open'` — triggers CSS enter animation.
   * - After close: `'closed'` — triggers CSS exit animation.
   */
  state = computed<string | undefined>(() => {
    if (this.dialog?.isOpen()) return 'open';
    return this._hasOpened ? 'closed' : undefined;
  });

  /** Returns 'alertdialog' for alert mode, 'dialog' otherwise */
  dialogRole = computed(() => this.dialog?.alert() ? 'alertdialog' : 'dialog');

  onOverlayClick(_event: MouseEvent): void {
    if (!this.dialog) return;
    // In alert mode, don't close on backdrop click (requires explicit action)
    if (this.dialog.alert()) return;
    this.dialog.close();
  }

  overlayClasses = computed(() =>
    cn(
      'fixed inset-0 z-50 bg-black/50 sng-dialog-overlay',
    )
  );

  contentClasses = computed(() =>
    cn(
      'pointer-events-auto relative w-full max-w-[calc(100%-2rem)] sm:max-w-lg',
      'grid gap-4 border bg-background p-6 shadow-lg rounded-lg outline-none',
      'sng-dialog-panel',
      this.class()
    )
  );
}
