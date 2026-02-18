import {
  Component,
  input,
  computed,
  inject,
  forwardRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef,
  booleanAttribute,
} from '@angular/core';
import { SngAccordionItem } from './sng-accordion-item';
import { cn } from './cn';
import type { SngAccordionTriggerApi } from './sng-accordion.types';

/**
 * Clickable trigger button for an accordion item.
 * Handles click interaction and ARIA attributes.
 *
 * @example
 * ```html
 * <sng-accordion-trigger>Section Title</sng-accordion-trigger>
 * ```
 *
 * @publicApi
 */
@Component({
  selector: 'sng-accordion-trigger',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
    '(click)': 'onClick()',
    '[attr.tabindex]': 'item.isDisabled() ? -1 : 0',
    role: 'button',
    '[attr.id]': 'item.triggerId',
    '[attr.aria-expanded]': 'item.isExpanded()',
    '[attr.aria-controls]': 'item.contentId',
    '[attr.aria-disabled]': 'item.isDisabled() || null',
    '[attr.data-orientation]': 'item.accordion.orientation()',
  },
  template: `
    <ng-content />
    @if (showChevron()) {
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        [class]="chevronClasses()"
      >
        <path d="m6 9 6 6 6-6"/>
      </svg>
    }
  `,
})
export class SngAccordionTrigger implements SngAccordionTriggerApi {
  /**
   * Native element reference for focus management.
   * @internal
   */
  private elementRef = inject(ElementRef<HTMLElement>);

  /**
   * Reference to parent accordion item.
   * @internal
   */
  item = inject(forwardRef(() => SngAccordionItem));

  /** Custom CSS classes. */
  class = input<string>('');

  /** Whether to show the chevron icon. */
  showChevron = input(true, { transform: booleanAttribute });

  /** Whether the parent item is currently expanded. */
  isExpanded = computed(() => this.item.isExpanded());

  /**
   * Whether using horizontal layout.
   * @internal
   */
  isHorizontal = computed(() => this.item.accordion.layout() === 'horizontal');

  /**
   * Combined host classes with state-based styling.
   * @internal
   */
  hostClasses = computed(() =>
    cn(
      'flex text-sm font-medium',
      'transition-colors outline-none cursor-pointer',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      this.isHorizontal()
        ? [
            'hover:bg-accent hover:text-accent-foreground',
            this.item.isExpanded()
              // Expanded: horizontal row layout, ml-4 aligns with content padding
              ? 'flex-row items-center gap-2 pt-2 pl-2 pr-4 pb-3 ml-4 rounded-md'
              // Collapsed: fill full height, vertical text
              : 'flex-1 h-full w-full items-center justify-between pt-4 pb-5 [writing-mode:vertical-lr] [text-orientation:upright]',
          ]
        : 'flex-1 items-start justify-between gap-4 py-4 text-left hover:underline rounded-md',
      this.item.isDisabled() && 'pointer-events-none opacity-50',
      this.class()
    )
  );

  /**
   * Chevron icon classes based on layout and state.
   * @internal
   */
  chevronClasses = computed(() =>
    cn(
      'text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200',
      this.isHorizontal()
        // Horizontal: collapsed chevron points right (order-1 places it above text)
        ? !this.item.isExpanded() && '-rotate-90 order-1'
        // Vertical: chevron rotates 180° when expanded
        : ['translate-y-0.5', this.item.isExpanded() && 'rotate-180']
    )
  );

  /** Handle activation to toggle expansion. */
  onClick(): void {
    this.item.toggle();
  }

  /** Programmatically focus this trigger element. */
  focus(): void {
    this.elementRef.nativeElement.focus();
  }
}
