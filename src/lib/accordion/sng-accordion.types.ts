/**
 * Type definitions for SngAccordion components.
 * @packageDocumentation
 */

/** Expansion behavior mode for the accordion. */
export type SngAccordionType = 'single' | 'multiple';

/** Orientation value for accordion semantics. */
export type SngAccordionOrientation = 'vertical' | 'horizontal';

/** Layout direction for the accordion. Affects layout and animation axis. */
export type SngAccordionLayout = 'vertical' | 'horizontal';

/** Value type for tracking expanded items. `string` in single mode, `string[]` in multiple. */
export type SngAccordionValue = string | string[];

/** Data state attribute values for CSS styling hooks. */
export type SngAccordionState = 'open' | 'closed';

/** Public API interface for SngAccordion root component. */
export interface SngAccordionApi {
  /** Whether the entire accordion is disabled */
  readonly disabled: () => boolean;

  /** Orientation value */
  readonly orientation: () => SngAccordionOrientation;

  /** Layout direction */
  readonly layout: () => SngAccordionLayout;

  /** Toggle expansion state of an item. */
  toggle(value: string): void;

  /** Check if a specific item is currently expanded. */
  isExpanded(value: string): boolean;
}

/** Public API interface for SngAccordionItem component. */
export interface SngAccordionItemApi {
  /** Unique identifier for this item */
  readonly value: () => string;

  /** Whether this item is explicitly disabled */
  readonly disabled: () => boolean;

  /** Whether this item is effectively disabled (own state or parent accordion). */
  readonly isDisabled: () => boolean;

  /** Whether this item is currently expanded */
  readonly isExpanded: () => boolean;

  /** ARIA ID for the trigger element */
  readonly triggerId: string;

  /** ARIA ID for the content element */
  readonly contentId: string;

  /** Toggle this item's expansion state */
  toggle(): void;

  /** Focus the trigger element */
  focusTrigger(): void;
}

/** Public API interface for SngAccordionTrigger component. */
export interface SngAccordionTriggerApi {
  /** Whether the parent item is expanded */
  readonly isExpanded: () => boolean;

  /** Focus this trigger element */
  focus(): void;
}

/** Public API interface for SngAccordionContent component. */
export interface SngAccordionContentApi {
  /** Whether the parent item is expanded */
  readonly isExpanded: () => boolean;

  /** Current state for data attribute ('open' | 'closed') */
  readonly state: () => SngAccordionState;
}
