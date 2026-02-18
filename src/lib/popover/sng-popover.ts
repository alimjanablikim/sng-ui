import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  contentChild,
  ElementRef,
  inject,
  OnDestroy,
  AfterContentInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Overlay, OverlayPositionBuilder, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import { SngPopoverTrigger } from './sng-popover-trigger';
import { SngPopoverContent } from './sng-popover-content';
import { cn } from './cn';

type OverlaySide = 'top' | 'bottom' | 'left' | 'right';

function getOverlayPosition(side: OverlaySide, offset = 4): ConnectedPosition {
  const positions: Record<OverlaySide, ConnectedPosition> = {
    top: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -offset },
    bottom: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: offset },
    left: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -offset },
    right: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: offset },
  };
  return positions[side];
}

class OverlayLifecycle {
  private _overlayRef: OverlayRef | null = null;
  private _subscriptions = new Subscription();
  private _closing = false;
  readonly isOpen: WritableSignal<boolean> = signal(false);

  get overlayRef(): OverlayRef | null { return this._overlayRef; }
  get overlayElement(): HTMLElement | null { return this._overlayRef?.overlayElement ?? null; }

  attach(overlayRef: OverlayRef): void {
    this._overlayRef = overlayRef;
    this.isOpen.set(true);
  }

  addSubscription(subscription: Subscription): void { this._subscriptions.add(subscription); }
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
    if (this._overlayRef) { this._overlayRef.detach(); this._overlayRef.dispose(); this._overlayRef = null; }
    this.isOpen.set(false);
  }

  destroy(): void { this.dispose(); }
}

export type PopoverSide = OverlaySide;

/**
 * Container component that manages popover state and trigger/content coordination.
 *
 * @example
 * ```html
 * <sng-popover>
 *   <sng-popover-trigger>Open</sng-popover-trigger>
 *   <sng-popover-content>Content here</sng-popover-content>
 * </sng-popover>
 * ```
 */
@Component({
  selector: 'sng-popover',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngPopover implements AfterContentInit, OnDestroy {
  /** Custom CSS classes. */
  class = input<string>('');

  /** Preferred side relative to the trigger. */
  side = input<PopoverSide>('bottom');

  private overlay = inject(Overlay);
  private overlayPositionBuilder = inject(OverlayPositionBuilder);
  private lifecycle = new OverlayLifecycle();

  trigger = contentChild(SngPopoverTrigger);
  content = contentChild(SngPopoverContent);

  isOpen = this.lifecycle.isOpen;

  hostClasses = computed(() => cn('inline-block', this.class()));

  ngAfterContentInit() {
    const triggerDirective = this.trigger();
    if (triggerDirective) {
      triggerDirective.registerPopover(this);
    }
  }

  toggle(triggerElement: ElementRef) {
    if (this.isOpen()) {
      this.hide();
    } else {
      this.show(triggerElement);
    }
  }

  private show(triggerElement: ElementRef) {
    if (this.lifecycle.hasOverlay()) return;

    // Get the actual positioning element (handles display: contents wrappers like sng-button)
    const positionElement = this.getPositionElement(triggerElement.nativeElement);
    if (!positionElement) {
      console.warn('SngPopover: Cannot open - no element with dimensions found');
      return;
    }

    const primary = this.side();
    const fallbackMap: Record<OverlaySide, OverlaySide> = {
      bottom: 'top', top: 'bottom', left: 'right', right: 'left',
    };
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(positionElement)
      .withPositions([
        getOverlayPosition(primary),
        getOverlayPosition(fallbackMap[primary]),
      ])
      .withPush(true)
      .withViewportMargin(8);

    const overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    const contentComponent = this.content();
    if (contentComponent) {
      const portal = new TemplatePortal(
        contentComponent.templateRef,
        contentComponent.viewContainerRef
      );
      overlayRef.attach(portal);
    }

    this.lifecycle.attach(overlayRef);
    this.lifecycle.addSubscription(
      overlayRef.backdropClick().subscribe(() => this.hide())
    );
    this.lifecycle.addSubscription(
      overlayRef.detachments().subscribe(() => {
        if (this.lifecycle.isOpen()) {
          this.lifecycle.dispose();
        }
      })
    );
  }

  hide() {
    this.lifecycle.close();
  }

  /** @internal Gets the actual position element, handling display: contents wrappers. */
  private getPositionElement(element: HTMLElement): HTMLElement | null {
    const rect = element.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      return element;
    }

    // Recurse through display: contents wrappers (e.g. sng-popover-trigger > sng-button > button)
    if (getComputedStyle(element).display === 'contents') {
      for (const child of Array.from(element.children)) {
        if (child instanceof HTMLElement) {
          const found = this.getPositionElement(child);
          if (found) return found;
        }
      }
    }

    return null;
  }

  ngOnDestroy() {
    this.lifecycle.destroy();
  }
}
