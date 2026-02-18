import {
  Component,
  signal,
  input,
  booleanAttribute,
  ChangeDetectionStrategy,
  TemplateRef,
  ViewContainerRef,
  inject,
  Injector,
  InjectionToken,
  OnDestroy,
  Renderer2,
  contentChild,
} from '@angular/core';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { SngDrawerWrapper } from './sng-drawer-wrapper';

/** Side from which the drawer slides in */
export type SngDrawerSide = 'top' | 'bottom' | 'left' | 'right';

/** Injection token providing a function to close the drawer */
export const SNG_DRAWER_CLOSE = new InjectionToken<() => void>('SNG_DRAWER_CLOSE');

/** Injection token providing access to the parent SngDrawer instance */
export const SNG_DRAWER_INSTANCE = new InjectionToken<SngDrawer>('SNG_DRAWER_INSTANCE');

/** Touch-friendly modal dialog that slides in from screen edges via CDK Overlay. */
@Component({
  selector: 'sng-drawer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'contents',
  },
  template: `<ng-content />`,
})
export class SngDrawer implements OnDestroy {
  /** Side from which the drawer appears. */
  side = input<SngDrawerSide>('bottom');

  /** Whether to scale and round the background content when drawer opens. */
  shouldScaleBackground = input(true, { transform: booleanAttribute });

  /** When true, uses a simple modal backdrop without background scaling. */
  modal = input(false, { transform: booleanAttribute });

  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);
  private overlayRef: OverlayRef | null = null;
  private subscriptions = new Subscription();
  private _closing = false;

  /** @internal */
  private wrapperDirective = contentChild(SngDrawerWrapper);

  isOpen = signal(false);

  /** Opens the drawer with the given template. Animation lifecycle only -- no business logic here. */
  open(template: TemplateRef<unknown>) {
    if (this.overlayRef || this._closing) return;

    const config = new OverlayConfig({
      hasBackdrop: false, // We handle backdrop in sng-drawer-content template
      panelClass: 'sng-drawer-panel',
      positionStrategy: this.overlay.position().global(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    this.overlayRef = this.overlay.create(config);
    const injector = Injector.create({
      providers: [
        { provide: SNG_DRAWER_CLOSE, useValue: () => this.close() },
        { provide: SNG_DRAWER_INSTANCE, useValue: this },
      ],
      parent: this.viewContainerRef.injector,
    });
    const portal = new TemplatePortal(template, this.viewContainerRef, null, injector);
    this.overlayRef.attach(portal);
    this.isOpen.set(true);

    // Only scale background if not in modal mode and shouldScaleBackground is true
    if (!this.modal() && this.shouldScaleBackground()) {
      this.scaleBackground();
    }

    this.subscriptions.add(
      this.overlayRef.backdropClick().subscribe(() => this.close())
    );
  }

  private scaleBackground() {
    const wrapper = this.getWrapper();
    if (!wrapper) return;

    this.renderer.setStyle(wrapper, 'transition', 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1), border-radius 0.5s cubic-bezier(0.32, 0.72, 0, 1)');
    this.renderer.setStyle(wrapper, 'transform-origin', 'center top');
    this.renderer.setStyle(wrapper, 'transform', 'scale(0.95) translateY(10px)');
    this.renderer.setStyle(wrapper, 'border-radius', '10px');
    this.renderer.setStyle(this.document.body, 'background-color', 'black');
  }

  private resetBackground() {
    const wrapper = this.getWrapper();
    if (!wrapper) return;

    this.renderer.removeStyle(wrapper, 'transition');
    this.renderer.removeStyle(wrapper, 'transform-origin');
    this.renderer.removeStyle(wrapper, 'transform');
    this.renderer.removeStyle(wrapper, 'border-radius');
    this.renderer.removeStyle(this.document.body, 'background-color');
  }

  private getWrapper(): HTMLElement | null {
    return this.wrapperDirective()?.elementRef.nativeElement ||
      this.document.querySelector('sng-drawer-wrapper') as HTMLElement;
  }

  /** Closes with exit animation, then disposes. Animation lifecycle only -- no business logic here. */
  close() {
    if (!this.overlayRef || this._closing) return;
    this._closing = true;

    this.isOpen.set(false);

    if (!this.modal() && this.shouldScaleBackground()) {
      this.resetBackground();
    }

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
  }

  ngOnDestroy() {
    this.dispose();
  }
}
