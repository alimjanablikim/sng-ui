import { Component, ChangeDetectionStrategy, ElementRef, inject, input, signal, computed, booleanAttribute } from '@angular/core';
import { cn } from './cn';

export type SngNavMenuLayout = 'horizontal' | 'vertical';
export type SngNavMenuSide = 'bottom' | 'top' | 'left' | 'right';
export type SngNavMenuAlign = 'item' | 'full';

/**
 * Root container for the navigation menu.
 *
 * @example
 * ```html
 * <sng-nav-menu>
 *   <sng-nav-menu-list>
 *     <sng-nav-menu-item>
 *       <sng-nav-menu-trigger>Products</sng-nav-menu-trigger>
 *       <sng-nav-menu-content>
 *         <a sngNavMenuLink href="/products">All Products</a>
 *       </sng-nav-menu-content>
 *     </sng-nav-menu-item>
 *   </sng-nav-menu-list>
 * </sng-nav-menu>
 * ```
 */
@Component({
  selector: 'sng-nav-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '(document:click)': 'onDocumentClick($event)',
  },
  template: `<ng-content />`,
})
export class SngNavMenu {
  /** Custom CSS classes. */
  class = input<string>('');

  /** Layout direction. */
  layout = input<SngNavMenuLayout>('horizontal');

  /** Side where content panels appear. Defaults to bottom (horizontal) or right (vertical). */
  side = input<SngNavMenuSide | undefined>(undefined);

  /** Panel alignment: 'full' positions relative to the nav bar, 'item' relative to trigger. */
  align = input<SngNavMenuAlign>('full');

  /** Whether menus open on hover. */
  hover = input(true, { transform: booleanAttribute });

  private elementRef = inject(ElementRef);

  /** Resolved side based on layout when not explicitly set. */
  resolvedSide = computed<SngNavMenuSide>(() => {
    const explicit = this.side();
    if (explicit) return explicit;
    return this.layout() === 'horizontal' ? 'bottom' : 'right';
  });

  hostClasses = computed(() =>
    cn(
      'relative flex max-w-max flex-1 items-center justify-center',
      this.openItemId() ? 'z-50' : 'z-10',
      this.class()
    )
  );

  /** Currently open item ID. */
  openItemId = signal<string | null>(null);

  private itemCounter = 0;

  /** @internal Generate unique ID for item. */
  generateItemId(): string {
    return `nav-item-${++this.itemCounter}`;
  }

  /** Open specific item, close others. */
  openItem(itemId: string): void {
    this.openItemId.set(itemId);
  }

  /** Close all items. */
  closeAll(): void {
    this.openItemId.set(null);
  }

  /** Check if item is open. */
  isItemOpen(itemId: string): boolean {
    return this.openItemId() === itemId;
  }

  /** @internal */
  onDocumentClick(event: MouseEvent): void {
    if (this.openItemId() && !this.elementRef.nativeElement.contains(event.target)) {
      this.closeAll();
    }
  }
}
