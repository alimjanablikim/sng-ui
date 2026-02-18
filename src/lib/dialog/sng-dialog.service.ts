import {
  Injectable,
  Injector,
  InjectionToken,
  Type,
  inject,
  signal,
} from '@angular/core';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';
import { SNG_DIALOG_CLOSE, SNG_DIALOG_INSTANCE } from './sng-dialog';

/** Injection token for passing data to dialog components */
export const SNG_DIALOG_DATA = new InjectionToken<unknown>('SNG_DIALOG_DATA');

/** Configuration options for opening a dialog */
export interface SngDialogConfig<D = unknown> {
  /** Data to pass to the dialog component (inject with SNG_DIALOG_DATA) */
  data?: D;
  /** Width of the dialog (e.g., '400px', '80vw') */
  width?: string;
  /** Max width of the dialog */
  maxWidth?: string;
  /** Height of the dialog */
  height?: string;
  /** Max height of the dialog */
  maxHeight?: string;
  /** Whether clicking the backdrop closes the dialog (default: true) */
  disableClose?: boolean;
  /** Custom panel class for styling */
  panelClass?: string | string[];
  /** Whether the dialog has a backdrop (default: true) */
  hasBackdrop?: boolean;
  /** Custom backdrop class */
  backdropClass?: string;
}

/** Reference to an opened dialog */
export class SngDialogRef<T = unknown, R = unknown> {
  private readonly _afterClosed = new Subject<R | undefined>();
  private _result: R | undefined;
  private _closing = false;

  /** @internal Signal for SngDialogContent to track open state */
  _isOpenSignal: ReturnType<typeof signal<boolean>> | null = null;

  /** Observable that emits when the dialog is closed */
  readonly afterClosed$ = this._afterClosed.asObservable();

  constructor(
    private overlayRef: OverlayRef,
    /** The component instance inside the dialog */
    public readonly componentInstance: T
  ) { }

  /**
   * Closes the dialog with a CSS exit animation, then disposes the overlay.
   *
   * **Animation lifecycle only** — triggers the exit animation by setting
   * `data-state="closed"` on overlay elements and waits for all CSS animations
   * to finish (via Web Animations API) before removing the overlay.
   *
   * Do not add business logic here. Instead, use `afterClosed$` to react
   * after the dialog is fully closed:
   * ```typescript
   * dialogRef.afterClosed$.subscribe(result => {
   *   if (result) this.saveData(result);
   * });
   * ```
   *
   * @param result Optional value to pass to `afterClosed$` subscribers.
   */
  close(result?: R): void {
    if (this._closing) return;
    this._closing = true;
    this._result = result;

    // Signal SngDialogContent that we're closing
    this._isOpenSignal?.set(false);

    // Set data-state="closed" directly on DOM to trigger CSS exit animations
    const panel = this.overlayRef.overlayElement;
    panel.querySelectorAll('[data-state]').forEach(el =>
      el.setAttribute('data-state', 'closed')
    );

    const doDispose = () => {
      this.overlayRef.dispose();
      this._afterClosed.next(result);
      this._afterClosed.complete();
    };

    // getAnimations() flushes styles, so newly triggered animations are returned.
    const animations = panel.getAnimations({ subtree: true });
    if (animations.length > 0) {
      Promise.allSettled(animations.map(animation => animation.finished)).finally(doDispose);
    } else {
      doDispose();
    }
  }

  /** Get the result (available after close) */
  get result(): R | undefined {
    return this._result;
  }
}

@Injectable({ providedIn: 'root' })
export class SngDialogService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);

  /** Currently open dialogs (any type to allow heterogeneous dialog types) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private openDialogs: SngDialogRef<any, any>[] = [];

  /**
   * Open a dialog with the given component
   *
   * @example
   * ```typescript
   * const dialogRef = this.dialogService.open(MyDialogComponent, {
   *   data: { name: 'World' },
   *   width: '400px'
   * });
   *
   * dialogRef.afterClosed$.subscribe(result => {
   *   console.log('Dialog closed with:', result);
   * });
   * ```
   */
  open<T, D = unknown, R = unknown>(
    component: Type<T>,
    config: SngDialogConfig<D> = {}
  ): SngDialogRef<T, R> {
    const overlayRef = this.createOverlay(config);
    const dialogRef = new SngDialogRef<T, R>(overlayRef, null as unknown as T);

    // Create adapter for SNG_DIALOG_INSTANCE (used by SngDialogContent)
    // Start as false so the closed→open transition triggers sng-dialog-enter animation
    const isOpenSignal = signal(false);
    dialogRef._isOpenSignal = isOpenSignal;
    const dialogInstanceAdapter = {
      isOpen: isOpenSignal,
      close: () => dialogRef.close(),
      alert: () => false,
    };

    // Create injector with dialog-specific providers
    const dialogInjector = Injector.create({
      providers: [
        { provide: SNG_DIALOG_DATA, useValue: config.data },
        { provide: SNG_DIALOG_CLOSE, useValue: () => dialogRef.close() },
        { provide: SngDialogRef, useValue: dialogRef },
        { provide: SNG_DIALOG_INSTANCE, useValue: dialogInstanceAdapter },
      ],
      parent: this.injector,
    });

    // Create and attach the component
    const portal = new ComponentPortal(component, null, dialogInjector);
    const componentRef = overlayRef.attach(portal);

    // Set open after attach so SngDialogContent transitions from closed→open
    isOpenSignal.set(true);

    // Update dialogRef with actual component instance
    (dialogRef as SngDialogRef<T, R> & { componentInstance: T }).componentInstance = componentRef.instance;

    // Handle backdrop click
    if (!config.disableClose) {
      overlayRef.backdropClick().subscribe(() => dialogRef.close());
    }

    // Track open dialogs
    this.openDialogs.push(dialogRef);
    dialogRef.afterClosed$.subscribe(() => {
      const index = this.openDialogs.indexOf(dialogRef);
      if (index > -1) {
        this.openDialogs.splice(index, 1);
      }
    });

    return dialogRef;
  }

  /** Close all open dialogs */
  closeAll(): void {
    // Make a copy because close() modifies the openDialogs array
    [...this.openDialogs].forEach((dialogRef) => dialogRef.close());
  }

  private createOverlay(config: SngDialogConfig): OverlayRef {
    const overlayConfig = new OverlayConfig({
      hasBackdrop: false, // SngDialogContent handles its own backdrop overlay
      panelClass: this.getPanelClasses(config),
      width: config.width,
      maxWidth: config.maxWidth || '90vw',
      height: config.height,
      maxHeight: config.maxHeight || '90vh',
      positionStrategy: this.overlay
        .position()
        .global(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    return this.overlay.create(overlayConfig);
  }

  private getPanelClasses(config: SngDialogConfig): string[] {
    const classes = ['sng-dialog-panel'];
    if (config.panelClass) {
      if (Array.isArray(config.panelClass)) {
        classes.push(...config.panelClass);
      } else {
        classes.push(config.panelClass);
      }
    }
    return classes;
  }
}
