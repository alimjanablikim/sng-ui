import { Component, ChangeDetectionStrategy, input, inject, computed, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { SngNavMenu } from './sng-nav-menu';
import { cn } from './cn';

/**
 * Individual navigation menu item. Acts as the positioning anchor for content panels.
 *
 * @example
 * ```html
 * <sng-nav-menu-item>
 *   <sng-nav-menu-trigger>Products</sng-nav-menu-trigger>
 *   <sng-nav-menu-content>
 *     <a sngNavMenuLink href="/products">All Products</a>
 *   </sng-nav-menu-content>
 * </sng-nav-menu-item>
 * ```
 */
@Component({
  selector: 'sng-nav-menu-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
  template: `<ng-content />`,
})
export class SngNavMenuItem implements OnInit, OnDestroy {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() => {
    const isItemAlign = this.menu?.align() !== 'full';
    return cn(isItemAlign ? 'relative' : '', this.isOpen() ? 'z-50' : '', this.class());
  });

  private menu = inject(SngNavMenu, { optional: true });
  private ngZone = inject(NgZone);
  private itemId = '';
  private closeTimerSubscription: Subscription | null = null;

  /** Whether this item's content is open. */
  isOpen = computed(() => {
    if (!this.menu) return false;
    return this.menu.isItemOpen(this.itemId);
  });

  /** Whether hover-to-open is enabled. */
  isHoverEnabled = computed(() => this.menu?.hover() ?? true);

  ngOnInit(): void {
    if (this.menu) {
      this.itemId = this.menu.generateItemId();
    }
  }

  ngOnDestroy(): void {
    this.clearCloseTimer();
  }

  /** Open this item's content. */
  open(): void {
    this.menu?.openItem(this.itemId);
  }

  /** Close this item's content. */
  close(): void {
    if (this.isOpen()) {
      this.menu?.closeAll();
    }
  }

  /** Toggle this item's content visibility. */
  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  /** @internal */
  onMouseEnter(): void {
    if (this.isHoverEnabled()) {
      this.clearCloseTimer();
      this.open();
    }
  }

  /** @internal */
  onMouseLeave(): void {
    if (this.isHoverEnabled()) {
      this.clearCloseTimer();
      this.ngZone.runOutsideAngular(() => {
        this.closeTimerSubscription = timer(100).subscribe(() => {
          this.ngZone.run(() => this.close());
          this.closeTimerSubscription = null;
        });
      });
    }
  }

  private clearCloseTimer(): void {
    this.closeTimerSubscription?.unsubscribe();
    this.closeTimerSubscription = null;
  }
}
