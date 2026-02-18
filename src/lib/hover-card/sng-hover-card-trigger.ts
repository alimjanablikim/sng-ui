import {
  Directive,
  ElementRef,
  inject,
} from '@angular/core';
import type { SngHoverCard } from './sng-hover-card';

/**
 * Directive that marks an element as the trigger for a hover card.
 * Opens the hover card on mouse enter and closes on mouse leave.
 *
 * @example
 * ```html
 * <sng-hover-card>
 *   <sng-hover-card-trigger href="#">Hover over me</sng-hover-card-trigger>
 *   <sng-hover-card-content>Content</sng-hover-card-content>
 * </sng-hover-card>
 * ```
 */
@Directive({
  selector: 'sng-hover-card-trigger',
  standalone: true,
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class SngHoverCardTrigger {
  private elementRef = inject(ElementRef);
  private hoverCard: SngHoverCard | null = null;

  registerHoverCard(hoverCard: SngHoverCard) {
    this.hoverCard = hoverCard;
  }

  onMouseEnter() {
    this.hoverCard?.onTriggerEnter(this.elementRef);
  }

  onMouseLeave() {
    this.hoverCard?.onTriggerLeave();
  }
}
