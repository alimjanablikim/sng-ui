import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  signal,
  OnDestroy,
} from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { cn } from './cn';

/**
 * Scrollable content area of the sidebar containing navigation groups and menus.
 * Features an auto-hiding scrollbar for a cleaner appearance.
 *
 * @example
 * ```html
 * <sng-layout-sidebar>
 *   <sng-layout-sidebar-header>...</sng-layout-sidebar-header>
 *   <sng-layout-sidebar-content [autoHideScrollbar]="2000">
 *     <sng-layout-sidebar-group>
 *       <sng-layout-sidebar-menu>...</sng-layout-sidebar-menu>
 *     </sng-layout-sidebar-group>
 *   </sng-layout-sidebar-content>
 *   <sng-layout-sidebar-footer>...</sng-layout-sidebar-footer>
 * </sng-layout-sidebar>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-scrollbar-visible]': 'scrollbarVisible()',
    '(scroll)': 'onScroll()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
  styles: `
    :host {
      /* Thin scrollbar for webkit browsers */
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background-color: transparent;
        border-radius: 3px;
        transition: background-color 0.3s ease;
      }

      /* Firefox thin scrollbar - hidden by default */
      scrollbar-width: thin;
      scrollbar-color: transparent transparent;
      transition: scrollbar-color 0.3s ease;

      /* Show scrollbar when visible */
      &[data-scrollbar-visible="true"]::-webkit-scrollbar-thumb {
        background-color: var(--sidebar-border, var(--border));
      }
      &[data-scrollbar-visible="true"]::-webkit-scrollbar-thumb:hover {
        background-color: var(--muted-foreground);
      }
      &[data-scrollbar-visible="true"] {
        scrollbar-color: var(--sidebar-border, var(--border)) transparent;
      }
    }
  `,
})
export class SngLayoutSidebarContent implements OnDestroy {
  /** Custom CSS classes. */
  class = input<string>('');

  /**
   * Auto-hide scrollbar after timeout (in milliseconds). Set to 0 to disable auto-hide.
   */
  autoHideScrollbar = input<number>(1500);

  // Scrollbar visibility - computed based on autoHideScrollbar and manual state
  private manualScrollbarVisible = signal(false);
  scrollbarVisible = computed(() => {
    // If auto-hide is disabled (timeout = 0), always show scrollbar
    if (this.autoHideScrollbar() === 0) {
      return true;
    }
    return this.manualScrollbarVisible();
  });
  private hideTimerSubscription: Subscription | null = null;
  private isHovering = signal(false);

  hostClasses = computed(() =>
    cn(
      'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
      this.class()
    )
  );

  onScroll() {
    if (this.autoHideScrollbar() > 0) {
      this.showScrollbar();
      this.startHideTimer();
    }
  }

  onMouseEnter() {
    this.isHovering.set(true);
    // Don't show scrollbar on hover - only show when scrolling
    if (this.autoHideScrollbar() > 0) {
      this.clearHideTimer();
    }
  }

  onMouseLeave() {
    this.isHovering.set(false);
    if (this.autoHideScrollbar() > 0 && this.scrollbarVisible()) {
      this.startHideTimer();
    }
  }

  private showScrollbar() {
    this.manualScrollbarVisible.set(true);
  }

  private startHideTimer() {
    this.clearHideTimer();
    const timeout = this.autoHideScrollbar();
    if (timeout > 0) {
      this.hideTimerSubscription = timer(timeout).subscribe(() => {
        if (!this.isHovering()) {
          this.manualScrollbarVisible.set(false);
        }
        this.hideTimerSubscription = null;
      });
    }
  }

  private clearHideTimer() {
    this.hideTimerSubscription?.unsubscribe();
    this.hideTimerSubscription = null;
  }

  ngOnDestroy() {
    this.clearHideTimer();
  }
}
