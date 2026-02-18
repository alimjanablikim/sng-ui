import {
  Component,
  input,
  computed,
  inject,
  forwardRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { SngAccordionItem } from './sng-accordion-item';
import { cn } from './cn';
import type { SngAccordionContentApi, SngAccordionState, SngAccordionLayout } from './sng-accordion.types';

/**
 * Expandable content area for an accordion item.
 * Animates using CSS Grid row transitions.
 *
 * @example
 * ```html
 * <sng-accordion-content>
 *   <p>Your expandable content goes here.</p>
 * </sng-accordion-content>
 * ```
 *
 * @publicApi
 */
@Component({
  selector: 'sng-accordion-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.data-state]': 'state()',
    '[attr.data-layout]': 'layout()',
    '[attr.id]': 'item.contentId',
    '[attr.aria-labelledby]': 'item.triggerId',
    '[attr.aria-hidden]': 'isExpanded() ? null : "true"',
    '[attr.inert]': 'isExpanded() ? null : ""',
    role: 'region',
    '[class]': 'hostClasses()',
    '[style.grid-template-rows]': 'gridTemplateRows()',
  },
  template: `
    <div [class]="overflowClasses()">
      <div [class]="innerClasses()">
        <ng-content />
      </div>
    </div>
  `,
})
export class SngAccordionContent implements SngAccordionContentApi {
  /**
   * Reference to parent accordion item.
   * @internal
   */
  item = inject(forwardRef(() => SngAccordionItem));

  /** Custom CSS classes. */
  class = input<string>('');

  /** Whether the parent item is currently expanded. */
  isExpanded = computed(() => this.item.isExpanded());

  /**
   * Current layout from parent accordion.
   * @internal
   */
  layout = computed((): SngAccordionLayout => this.item.accordion.layout());

  /**
   * Whether using horizontal layout.
   * @internal
   */
  isHorizontal = computed(() => this.layout() === 'horizontal');

  /** Current state for `data-state` attribute: `'open'` or `'closed'`. */
  state = computed((): SngAccordionState => (this.isExpanded() ? 'open' : 'closed'));

  /**
   * Host classes based on layout.
   * @internal
   */
  hostClasses = computed(() =>
    cn(
      this.isHorizontal()
        ? [
            // Horizontal: hidden when collapsed, flex-1 when expanded
            'transition-opacity duration-300 ease-out',
            this.isExpanded() ? 'opacity-100 flex-1' : 'opacity-0 hidden',
          ]
        : [
            // Vertical: CSS Grid animation
            'grid transition-[grid-template-rows] duration-200 ease-out',
          ]
    )
  );

  /**
   * Grid template rows for vertical animation.
   * @internal
   */
  gridTemplateRows = computed(() =>
    // Vertical animation: 0fr (collapsed) to 1fr (expanded); horizontal uses display instead
    this.isHorizontal() ? 'none' : (this.isExpanded() ? '1fr' : '0fr')
  );

  /**
   * Overflow wrapper classes.
   * @internal
   */
  overflowClasses = computed(() =>
    cn(
      'overflow-hidden',
      // min-w-0 / min-h-0 allows content to shrink below intrinsic size during animation
      this.isHorizontal() ? 'min-w-0' : 'min-h-0'
    )
  );

  /**
   * Combined inner content classes.
   * @internal
   */
  innerClasses = computed(() =>
    cn(
      'text-sm',
      // Horizontal: equal padding all sides; Vertical: bottom padding only (trigger has top)
      this.isHorizontal() ? 'p-4' : 'pb-4 pt-0',
      this.class()
    )
  );
}
