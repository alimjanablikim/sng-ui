import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  ElementRef,
  inject,
  signal,
  contentChild,
} from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { SngMenuSubTrigger } from './sng-menu-sub-trigger';

/** Interface for parent content to coordinate sibling submenus. */
export interface MenuContentCoordinator {
  _requestSubOpen(sub: SngMenuSub): void;
  _notifySubClosed(sub: SngMenuSub): void;
  _shouldOpenImmediately(sub: SngMenuSub): boolean;
}

/**
 * Container for a nested submenu within a menu.
 * Opens on hover and contains a trigger and content.
 *
 * @example
 * ```html
 * <sng-menu-sub>
 *   <sng-menu-sub-trigger>More Options</sng-menu-sub-trigger>
 *   <sng-menu-sub-content>
 *     <sng-menu-item>Option A</sng-menu-item>
 *   </sng-menu-sub-content>
 * </sng-menu-sub>
 * ```
 */
@Component({
  selector: 'sng-menu-sub',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'block relative',
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
    '(mouseenter)': 'scheduleOpen()',
    '(mouseleave)': 'onMouseLeave($event)',
  },
  template: `<ng-content />`,
})
export class SngMenuSub implements OnDestroy {
  private hoverTimerSubscription: Subscription | null = null;

  /** @internal Host element reference. */
  _hostEl = inject(ElementRef).nativeElement;

  /** @internal The sub-trigger child for positioning. */
  _subTrigger = contentChild(SngMenuSubTrigger);

  /** @internal Set by parent content for sibling coordination. */
  _parentCoordinator: MenuContentCoordinator | null = null;

  /** @internal Dispose callback set by content for cascade close. */
  _contentDispose: (() => void) | null = null;

  isOpen = signal(false);

  open() {
    if (this.isOpen()) return;
    this.clearTimeout();
    this.isOpen.set(true);
    this._parentCoordinator?._requestSubOpen(this);
  }

  close() {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this._parentCoordinator?._notifySubClosed(this);
  }

  /** Immediately close without animation — used when switching between submenus. */
  closeImmediate() {
    this.clearTimeout();
    this.isOpen.set(false);
  }

  scheduleOpen() {
    this.clearTimeout();
    if (this._parentCoordinator?._shouldOpenImmediately(this)) {
      this.open();
    } else {
      this.hoverTimerSubscription = timer(100).subscribe(() => {
        this.hoverTimerSubscription = null;
        this.open();
      });
    }
  }

  /** @internal */
  onMouseLeave(event: MouseEvent) {
    const related = event.relatedTarget as HTMLElement | null;
    // If mouse moved into the submenu overlay panel, don't close
    if (related?.closest('.sng-menu-sub-panel')) return;
    this.scheduleClose();
  }

  scheduleClose() {
    this.clearTimeout();
    this.hoverTimerSubscription = timer(100).subscribe(() => {
      this.hoverTimerSubscription = null;
      this.close();
    });
  }

  /** @internal Reset all state when root menu closes. */
  _reset() {
    this.clearTimeout();
    this.isOpen.set(false);
  }

  private clearTimeout() {
    this.hoverTimerSubscription?.unsubscribe();
    this.hoverTimerSubscription = null;
  }

  ngOnDestroy() {
    this.clearTimeout();
  }
}
