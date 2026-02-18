import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
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
import { Subscription, timer } from 'rxjs';
import { SngHoverCardTrigger } from './sng-hover-card-trigger';
import { SngHoverCardContent } from './sng-hover-card-content';
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

export type HoverCardSide = OverlaySide;

/**
 * Container component for hover card functionality.
 * Displays a content panel on hover with configurable delays.
 * Uses CDK Overlay for positioning.
 *
 * @example
 * ```html
 * <sng-hover-card [openDelay]="300" [closeDelay]="200">
 *   <sng-hover-card-trigger href="#">@username</sng-hover-card-trigger>
 *   <sng-hover-card-content>
 *     <p>User profile preview</p>
 *   </sng-hover-card-content>
 * </sng-hover-card>
 * ```
 */
@Component({
  selector: 'sng-hover-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngHoverCard implements AfterContentInit, OnDestroy {
  /**
   * Custom CSS classes for the hover card container.
   */
  class = input<string>('');

  /**
   * Position of the hover card relative to the trigger element.
   */
  side = input<HoverCardSide>('bottom');

  /**
   * Delay in milliseconds before opening the hover card.
   */
  openDelay = input<number>(200);

  /**
   * Delay in milliseconds before closing the hover card.
   */
  closeDelay = input<number>(300);

  private overlay = inject(Overlay);
  private overlayPositionBuilder = inject(OverlayPositionBuilder);
  private lifecycle = new OverlayLifecycle();
  private openTimerSubscription: Subscription | null = null;
  private closeTimerSubscription: Subscription | null = null;

  trigger = contentChild(SngHoverCardTrigger);
  content = contentChild(SngHoverCardContent);

  isOpen = this.lifecycle.isOpen;

  hostClasses = computed(() => cn('inline-block', this.class()));

  ngAfterContentInit() {
    const triggerDirective = this.trigger();
    if (triggerDirective) {
      triggerDirective.registerHoverCard(this);
    }
  }

  onTriggerEnter(triggerElement: ElementRef) {
    this.clearCloseTimeout();
    if (this.isOpen()) return;
    const delay = Math.max(0, this.openDelay());
    if (delay === 0) {
      this.show(triggerElement);
      return;
    }
    this.openTimerSubscription = timer(delay).subscribe(() => {
      this.openTimerSubscription = null;
      this.show(triggerElement);
    });
  }

  onTriggerLeave() {
    this.clearOpenTimeout();
    this.scheduleClose();
  }

  onContentEnter() {
    this.clearCloseTimeout();
  }

  onContentLeave() {
    this.scheduleClose();
  }

  private scheduleClose() {
    const delay = Math.max(0, this.closeDelay());
    if (delay === 0) {
      this.hide();
      return;
    }
    this.closeTimerSubscription = timer(delay).subscribe(() => {
      this.closeTimerSubscription = null;
      this.hide();
    });
  }

  private clearOpenTimeout() {
    this.openTimerSubscription?.unsubscribe();
    this.openTimerSubscription = null;
  }

  private clearCloseTimeout() {
    this.closeTimerSubscription?.unsubscribe();
    this.closeTimerSubscription = null;
  }

  private show(triggerElement: ElementRef) {
    if (this.lifecycle.hasOverlay()) return;

    const primary = this.side();
    const fallbackMap: Record<OverlaySide, OverlaySide> = {
      bottom: 'top', top: 'bottom', left: 'right', right: 'left',
    };
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(triggerElement)
      .withPositions([
        getOverlayPosition(primary),
        getOverlayPosition(fallbackMap[primary]),
      ])
      .withPush(true)
      .withViewportMargin(8);

    const overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });

    const contentComponent = this.content();
    if (contentComponent) {
      contentComponent.hoverCard = this;
      const portal = new TemplatePortal(
        contentComponent.templateRef,
        contentComponent.viewContainerRef
      );
      overlayRef.attach(portal);
    }

    this.lifecycle.attach(overlayRef);
    this.lifecycle.addSubscription(
      overlayRef.detachments().subscribe(() => this.lifecycle.dispose())
    );
  }

  hide() {
    if (!this.lifecycle.hasOverlay()) return;
    this.lifecycle.close();
  }

  ngOnDestroy() {
    this.clearOpenTimeout();
    this.clearCloseTimeout();
    this.lifecycle.destroy();
  }
}
