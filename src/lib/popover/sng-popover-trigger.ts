import { Directive, ElementRef, inject, signal } from '@angular/core';
import type { SngPopover } from './sng-popover';

/**
 * Trigger directive for a popover. Toggles open/closed on click.
 *
 * @example
 * ```html
 * <sng-popover>
 *   <sng-popover-trigger>Click me</sng-popover-trigger>
 *   <sng-popover-content>Content</sng-popover-content>
 * </sng-popover>
 * ```
 */
@Directive({
  selector: 'sng-popover-trigger',
  standalone: true,
  host: {
    'class': 'contents',
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-expanded]': '_popover()?.isOpen()',
    '[attr.data-state]': '_popover()?.isOpen() ? "open" : "closed"',
    '(click)': 'onClick($event)',
  },
})
export class SngPopoverTrigger {
  /** @internal */
  _elementRef = inject(ElementRef);
  /** @internal */
  _popover = signal<SngPopover | null>(null);

  /** @internal */
  registerPopover(popover: SngPopover) {
    this._popover.set(popover);
  }

  onClick(event: Event) {
    event.stopPropagation();
    const popover = this._popover();
    if (popover) {
      popover.toggle(this._elementRef);
    }
  }
}
