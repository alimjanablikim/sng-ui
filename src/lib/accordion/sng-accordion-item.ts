import {
  Component,
  input,
  computed,
  inject,
  forwardRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  contentChild,
  signal,
  booleanAttribute,
  output,
  effect,
  ElementRef,
} from '@angular/core';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { SngAccordion } from './sng-accordion';
import { SngAccordionTrigger } from './sng-accordion-trigger';
import { cn } from './cn';
import type { SngAccordionItemApi, SngAccordionOrientation, SngAccordionLayout } from './sng-accordion.types';

/**
 * Generate a unique ID for ARIA linking.
 * @internal
 */
let nextAccordionId = 0;

function generateUniqueId(): string {
  nextAccordionId += 1;
  return `${nextAccordionId}`;
}

/**
 * Individual accordion item container wrapping a trigger and content.
 *
 * @example
 * ```html
 * <sng-accordion-item value="faq-1">
 *   <sng-accordion-trigger>What is Angular?</sng-accordion-trigger>
 *   <sng-accordion-content>Content here.</sng-accordion-content>
 * </sng-accordion-item>
 * ```
 *
 * @publicApi
 */
@Component({
  selector: 'sng-accordion-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  hostDirectives: [
    {
      directive: CdkAccordionItem,
      inputs: ['disabled'],
    },
  ],
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-state]': 'isExpanded() ? "open" : "closed"',
    '[attr.data-layout]': 'accordion.layout()',
  },
  template: `
    <h3 [class]="triggerWrapperClasses()">
      <ng-content select="sng-accordion-trigger" />
    </h3>
    <ng-content select="sng-accordion-content" />
  `,
})
export class SngAccordionItem implements SngAccordionItemApi {
  /**
   * Reference to parent accordion (optional for standalone usage).
   * @internal
   */
  private _accordion = inject(forwardRef(() => SngAccordion), { optional: true });

  /**
   * Reference to the trigger component for focus management.
   * @internal
   */
  private trigger = contentChild(forwardRef(() => SngAccordionTrigger));

  /**
   * Unique ID prefix for ARIA linking.
   * @internal
   */
  private id = `sng-accordion-${generateUniqueId()}`;

  /**
   * Internal open state for standalone mode.
   * @internal
   */
  private _standaloneOpen = signal<boolean | null>(null);

  /**
   * Element reference for DOM queries.
   * @internal
   */
  private elementRef = inject(ElementRef<HTMLElement>);

  /** Unique identifier for this item within the accordion. */
  value = input<string>('');

  /** Controlled open state for standalone mode. Ignored within an accordion. */
  open = input<boolean | undefined>(undefined);

  /** Whether the item is open by default in standalone uncontrolled mode. */
  defaultOpen = input(false, { transform: booleanAttribute });

  /**
   * Emits when open state changes (standalone mode only).
   */
  openChange = output<boolean>();

  /** Emits when the item opens. */
  opened = output<void>();

  /** Emits when the item closes. */
  closed = output<void>();

  /** Whether this item is explicitly disabled. */
  disabled = input(false, { transform: booleanAttribute });

  /** Custom CSS classes. */
  class = input<string>('');

  /**
   * Whether the item is used standalone (without parent accordion).
   * @internal
   */
  isStandalone = computed(() => !this._accordion);

  /**
   * Sync controlled standalone state into internal state.
   * @internal
   */
  private readonly syncControlledOpenEffect = effect(() => {
    const controlledOpen = this.open();
    if (controlledOpen !== undefined && this.isStandalone()) {
      this._standaloneOpen.set(controlledOpen);
    }
  });

  /**
   * Accordion-like API for standalone mode.
   * Returns the actual accordion or a minimal standalone implementation.
   * @internal
   */
  get accordion(): {
    disabled: () => boolean;
    orientation: () => SngAccordionOrientation;
    layout: () => SngAccordionLayout;
    toggle: (value: string) => void;
    isExpanded: (value: string) => boolean;
  } {
    if (this._accordion) {
      return this._accordion;
    }
    // Standalone mode - return minimal implementation
    return {
      disabled: () => false,
      orientation: () => 'vertical' as const,
      layout: () => 'vertical' as const,
      toggle: () => this._toggleStandalone(),
      isExpanded: () => this._isExpandedStandalone(),
    };
  }

  /** Whether this item is effectively disabled (own state or parent accordion). */
  isDisabled = computed(() => this.disabled() || (this._accordion?.disabled() ?? false));

  /** Generated ARIA ID for the trigger element. */
  triggerId = `${this.id}-trigger`;

  /** Generated ARIA ID for the content element. */
  contentId = `${this.id}-content`;

  /** Whether this item is currently expanded. */
  isExpanded = computed(() => {
    if (this._accordion) {
      return this._accordion.isExpanded(this.value());
    }
    return this._isExpandedStandalone();
  });

  /**
   * Track previous expansion state to emit `opened`/`closed` transitions.
   * @internal
   */
  private previousExpandedState: boolean | null = null;

  /**
   * Emit open/close outputs on expansion state transitions.
   * @internal
   */
  private readonly expansionOutputEffect = effect(() => {
    const expanded = this.isExpanded();
    if (this.previousExpandedState === null) {
      this.previousExpandedState = expanded;
      return;
    }
    if (this.previousExpandedState === expanded) {
      return;
    }
    this.previousExpandedState = expanded;
    if (expanded) {
      this.opened.emit();
    } else {
      this.closed.emit();
    }
  });

  /**
   * Whether the accordion is in horizontal layout.
   * @internal
   */
  isHorizontal = computed(() => this.accordion.layout() === 'horizontal');

  /**
   * Check if this item is the last child in its parent.
   * @internal
   */
  private isLastChild(): boolean {
    const el = this.elementRef.nativeElement;
    return el.parentElement?.lastElementChild === el;
  }

  /**
   * Combined host classes including user-provided classes.
   * @internal
   */
  hostClasses = computed(() =>
    cn(
      this.isHorizontal()
        ? [
            // Horizontal: flex column with width transition for expand/collapse animation
            'flex flex-col h-full overflow-hidden transition-[flex,width] duration-300 ease-out',
            // Expanded takes available space, collapsed has fixed width
            this.isExpanded() ? 'flex-1' : 'flex-none w-16',
          ]
        : 'block',
      !this.isStandalone() && (
        this.isHorizontal()
          // Hide right border on last expanded item (accordion border serves as edge)
          ? !(this.isLastChild() && this.isExpanded()) && 'border-r border-border'
          : 'border-b last:border-b-0'
      ),
      this.class()
    )
  );

  /**
   * Classes for the h3 trigger wrapper.
   * @internal
   */
  triggerWrapperClasses = computed(() =>
    cn(
      'flex !m-0',
      this.isHorizontal() && !this.isExpanded() && 'flex-1 h-full justify-center items-stretch'
    )
  );

  /** Toggle this item's expansion state. Does nothing if disabled. */
  toggle(): void {
    if (this.isDisabled()) return;
    if (this._accordion) {
      this._accordion.toggle(this.value());
    } else {
      this._toggleStandalone();
    }
  }

  /** Programmatically focus the trigger element. */
  focusTrigger(): void {
    this.trigger()?.focus();
  }

  /**
   * Toggle standalone open state.
   * @internal
   */
  private _toggleStandalone(): void {
    const newState = !this._isExpandedStandalone();
    this._standaloneOpen.set(newState);
    this.openChange.emit(newState);
  }

  /**
   * Check if expanded in standalone mode.
   * @internal
   */
  private _isExpandedStandalone(): boolean {
    const controlledOpen = this.open();
    if (controlledOpen !== undefined) {
      return controlledOpen;
    }
    const internalState = this._standaloneOpen();
    return internalState !== null ? internalState : this.defaultOpen();
  }
}
