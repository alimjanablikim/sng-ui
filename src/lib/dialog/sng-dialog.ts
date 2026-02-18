import {
  Component,
  signal,
  input,
  output,
  ChangeDetectionStrategy,
  TemplateRef,
  ViewContainerRef,
  inject,
  Injector,
  InjectionToken,
  OnDestroy,
  booleanAttribute,
  Signal,
  ElementRef,
} from '@angular/core';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';

export const SNG_DIALOG_CLOSE = new InjectionToken<() => void>('SNG_DIALOG_CLOSE');
export const SNG_DIALOG_INSTANCE = new InjectionToken<SngDialog>('SNG_DIALOG_INSTANCE');
export const SNG_DIALOG_STATE = new InjectionToken<Signal<boolean>>('SNG_DIALOG_STATE');

/**
 * Modal dialog container using CDK Overlay.
 * Manages dialog lifecycle including open/close animations.
 *
 * @example
 * ```html
 * <sng-dialog #dialog>
 *   <sng-button (click)="dialog.open(dialogContent)">Open Dialog</sng-button>
 *   <ng-template #dialogContent>
 *     <sng-dialog-content>
 *       <sng-dialog-header>
 *         <sng-dialog-title>Dialog Title</sng-dialog-title>
 *         <sng-dialog-description>Dialog description text.</sng-dialog-description>
 *       </sng-dialog-header>
 *       <sng-dialog-footer>
 *         <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" (click)="dialog.close()">Cancel</sng-button>
 *         <sng-button (click)="dialog.close()">Confirm</sng-button>
 *       </sng-dialog-footer>
 *     </sng-dialog-content>
 *   </ng-template>
 * </sng-dialog>
 * ```
 */
@Component({
  selector: 'sng-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'contents',
  },
  template: `<ng-content />`,
})
export class SngDialog implements OnDestroy {
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private hostElementRef = inject(ElementRef<HTMLElement>);
  private document = inject(DOCUMENT);
  private overlayRef: OverlayRef | null = null;
  private subscriptions = new Subscription();
  private _closing = false;
  /** Element that had focus before dialog opened (for focus restoration in alert mode) */
  private triggerElement: HTMLElement | null = null;
  /** Active signal driving the current dialog instance (for mimicking service behavior) */
  private _activeOpenSignal: ReturnType<typeof signal<boolean>> | null = null;

  /**
   * When true, behaves like an alert dialog:
   * - Uses role="alertdialog" instead of role="dialog"
   * - Does NOT close on backdrop click (requires explicit action)
   * - Restores focus to trigger element on close
   */
  alert = input(false, { transform: booleanAttribute });

  /**
   * Emits when open state changes.
   */
  openChange = output<boolean>();

  /** Whether the dialog is currently open. */
  isOpen = signal(false);

  /**
   * Opens the dialog with the given template content.
   * Creates a CDK Overlay, attaches the template, and triggers the CSS enter animation.
   *
   * This method is part of the **animation lifecycle** — it handles overlay creation
   * and the open transition. Do not place business logic here.
   * Use `openChange` output or template event handlers for user actions.
   *
   * @param template The template to render inside the overlay.
   * @param triggerElement Optional element to restore focus to on close (alert mode).
   */
  open(template: TemplateRef<unknown>, triggerElement?: HTMLElement) {
    if (this.overlayRef || this._closing) return;

    // Store trigger for focus restoration in alert mode
    if (this.alert()) {
      this.triggerElement = this.resolveTriggerElement(triggerElement);
    }

    // Create a fresh signal for this specific dialog instance to ensure
    // pristine state for the animation (mimicking SngDialogService behavior)
    const localIsOpen = signal(false);
    this._activeOpenSignal = localIsOpen;

    const dialogAdapter = {
      isOpen: localIsOpen,
      close: () => this.close(),
      alert: this.alert,
    };

    const config = new OverlayConfig({
      hasBackdrop: false, // We handle overlay in sng-dialog-content
      panelClass: this.alert() ? 'sng-alert-dialog-panel' : 'sng-dialog-panel',
      positionStrategy: this.overlay.position()
        .global(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    this.overlayRef = this.overlay.create(config);
    const injector = Injector.create({
      providers: [
        { provide: SNG_DIALOG_CLOSE, useValue: () => this.close() },
        { provide: SNG_DIALOG_INSTANCE, useValue: dialogAdapter },
        // Use local signal for state token as well
        { provide: SNG_DIALOG_STATE, useValue: localIsOpen },
      ],
      parent: this.viewContainerRef.injector,
    });
    const portal = new TemplatePortal(template, this.viewContainerRef, null, injector);
    this.overlayRef.attach(portal);

    // Sync local state with public state
    localIsOpen.set(true);
    this.isOpen.set(true);
    this.openChange.emit(true);

    // Overlay click is handled by sng-dialog-content's overlay div
  }

  /**
   * Closes the dialog with a CSS exit animation, then disposes the overlay.
   *
   * **Animation lifecycle only** — this method triggers the exit animation by
   * setting `data-state="closed"` on overlay elements and waits for all CSS
   * animations to finish (via Web Animations API) before removing the overlay.
   *
   * Do not add business logic (API calls, navigation, data saving) here.
   * Instead, use the `openChange` output or template event handlers:
   * ```html
   * <sng-button (click)="onSave(); dialog.close()">Save</sng-button>
   * ```
   * Or listen to `openChange`:
   * ```html
   * <sng-dialog (openChange)="onDialogStateChange($event)">
   * ```
   */
  close() {
    if (!this.overlayRef || this._closing) return;
    this._closing = true;

    this.isOpen.set(false);
    this._activeOpenSignal?.set(false);
    this.openChange.emit(false);

    // Set data-state="closed" directly on DOM to trigger CSS exit animations
    // immediately (Angular's signal binding will also set this on next CD — same value).
    const panel = this.overlayRef.overlayElement;
    panel.querySelectorAll('[data-state]').forEach(el =>
      el.setAttribute('data-state', 'closed')
    );

    // getAnimations() flushes styles, so newly triggered animations are returned.
    const animations = panel.getAnimations({ subtree: true });
    if (animations.length > 0) {
      Promise.allSettled(animations.map(animation => animation.finished)).finally(() => this.dispose());
    } else {
      this.dispose();
    }
  }

  /** @internal Immediately removes the overlay from DOM. Called after exit animation completes. */
  private dispose() {
    this._closing = false;
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.isOpen.set(false);

    // Restore focus to trigger element in alert mode
    if (this.alert() && this.triggerElement) {
      this.triggerElement.focus();
      this.triggerElement = null;
    }
  }

  /** Resolves a reliable trigger element for alert-mode focus restoration. */
  private resolveTriggerElement(explicitTrigger?: HTMLElement): HTMLElement | null {
    if (explicitTrigger) return explicitTrigger;

    const activeElement = this.document.activeElement;
    if (activeElement instanceof HTMLElement && activeElement !== this.document.body) {
      return activeElement;
    }

    const host = this.hostElementRef.nativeElement;
    const fallbackTrigger = host.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement | null;
    return fallbackTrigger ?? null;
  }

  ngOnDestroy() {
    this.dispose();
  }
}
