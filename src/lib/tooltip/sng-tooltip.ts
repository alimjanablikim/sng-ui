import {
  ComponentRef,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  WritableSignal,
} from '@angular/core';
import { Overlay, OverlayRef, type ConnectedPosition } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import { SngTooltipContent } from './sng-tooltip-content';

type OverlaySide = 'top' | 'bottom' | 'left' | 'right';

/**
 * Get overlay positions with fallbacks for each side.
 * Primary position is the requested side, with fallback to opposite side.
 */
function getOverlayPositions(side: OverlaySide, offset = 8): ConnectedPosition[] {
  const positions: Record<OverlaySide, ConnectedPosition[]> = {
    top: [
      { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -offset },
      { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: offset },
    ],
    bottom: [
      { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: offset },
      { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -offset },
    ],
    left: [
      { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -offset },
      { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: offset },
    ],
    right: [
      { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: offset },
      { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -offset },
    ],
  };
  return positions[side];
}

class OverlayLifecycle {
  private _overlayRef: OverlayRef | null = null;
  private _subscriptions = new Subscription();
  private _closing = false;
  readonly isOpen: WritableSignal<boolean> = signal(false);

  attach(overlayRef: OverlayRef): void {
    this._overlayRef = overlayRef;
    this.isOpen.set(true);
  }

  addSubscription(subscription: Subscription): void {
    this._subscriptions.add(subscription);
  }

  hasOverlay(): boolean { return this._overlayRef !== null; }

  /**
   * Closes the overlay with a CSS exit animation, then disposes.
   * Sets data-state="closed" on overlay elements and waits for all CSS
   * animations to finish (via Web Animations API) before removing the overlay.
   */
  close(): void {
    if (!this._overlayRef || this._closing) return;
    this._closing = true;
    this.isOpen.set(false);

    const panel = this._overlayRef.overlayElement;
    panel.querySelectorAll('[data-state]').forEach(el =>
      el.setAttribute('data-state', 'closed')
    );

    const animations = panel.getAnimations({ subtree: true });
    if (animations.length > 0) {
      Promise.allSettled(animations.map(animation => animation.finished)).finally(() => this.dispose());
    } else {
      this.dispose();
    }
  }

  dispose(): void {
    this._closing = false;
    this._subscriptions.unsubscribe();
    this._subscriptions = new Subscription();
    if (this._overlayRef) {
      this._overlayRef.detach();
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
    this.isOpen.set(false);
  }

  destroy(): void { this.dispose(); }
}

/**
 * Directive that displays a tooltip on hover or focus.
 * Uses CDK Overlay for positioning relative to the trigger element.
 *
 * @example
 * ```html
 * <button [sngTooltip]="'Click to save'" sngTooltipPosition="bottom">
 *   Save
 * </button>
 * ```
 */
@Directive({
  selector: '[sngTooltip]',
  standalone: true,
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(focus)': 'show()',
    '(blur)': 'hide()',
  },
})
export class SngTooltip implements OnDestroy {
  /**
   * Tooltip text content to display.
   */
  sngTooltip = input.required<string>();

  /**
   * Position of the tooltip relative to the trigger element.
   */
  sngTooltipPosition = input<OverlaySide>('top');

  /**
   * Custom CSS classes for tooltip styling.
   */
  sngTooltipClass = input<string>('');

  private overlay = inject(Overlay);
  private elementRef = inject(ElementRef);
  private lifecycle = new OverlayLifecycle();
  private componentRef: ComponentRef<SngTooltipContent> | null = null;

  show() {
    if (this.lifecycle.hasOverlay()) return;

    // Get the actual positioning element (handles display: contents wrappers like sng-button)
    const positionElement = this.getPositionElement(this.elementRef.nativeElement);
    if (!positionElement) {
      return;
    }

    const side = this.sngTooltipPosition();
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(positionElement)
      .withPositions(getOverlayPositions(side, 8))
      .withPush(true)
      .withViewportMargin(8);

    const overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });

    const portal = new ComponentPortal(SngTooltipContent);
    this.componentRef = overlayRef.attach(portal);
    this.componentRef.instance.text.set(this.sngTooltip());
    this.componentRef.instance.side.set(side);
    this.componentRef.instance.state.set('open');
    this.componentRef.instance.customClass.set(this.sngTooltipClass());

    this.lifecycle.attach(overlayRef);
  }

  /**
   * @internal
   * Gets the actual element to use for positioning.
   * Handles display: contents wrappers (like sng-button) by finding the first child with dimensions.
   */
  private getPositionElement(element: HTMLElement): HTMLElement | null {
    const rect = element.getBoundingClientRect();

    // If element has dimensions, use it directly
    if (rect.width > 0 && rect.height > 0) {
      return element;
    }

    // Check if element has display: contents (wrapper with no layout)
    const display = getComputedStyle(element).display;
    if (display === 'contents') {
      // Find first child element with actual dimensions
      for (const child of Array.from(element.children)) {
        if (child instanceof HTMLElement) {
          const childRect = child.getBoundingClientRect();
          if (childRect.width > 0 && childRect.height > 0) {
            return child;
          }
        }
      }
    }

    return null;
  }

  hide() {
    if (!this.lifecycle.hasOverlay()) return;
    // Set signal to 'closed' for Angular binding consistency
    if (this.componentRef) {
      this.componentRef.instance.state.set('closed');
    }
    this.lifecycle.close();
    this.componentRef = null;
  }

  ngOnDestroy() {
    this.lifecycle.destroy();
    this.componentRef = null;
  }
}
