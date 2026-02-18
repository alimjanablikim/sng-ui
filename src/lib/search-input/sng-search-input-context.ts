import { InjectionToken, Signal } from '@angular/core';

/**
 * Context interface for search sub-components to inject.
 */
export interface SngSearchInputContext {
  /** Current search query */
  searchQuery: Signal<string>;
  /** Count of visible items */
  visibleItemCount: Signal<number>;
  /** Whether command palette mode is active (all items visible by default). */
  command: Signal<boolean>;
  /** Recently selected item values, shown even when command mode is active. */
  recentValues: Signal<string[]>;
  /** Update visible item count */
  updateVisibleCount: (delta: number) => void;
  /** Close the dropdown */
  closeDropdown: () => void;
  /** @internal Track a selected item value for recent items. */
  trackSelection: (value: string) => void;
}

/** Injection token for search context. */
export const SNG_SEARCH_INPUT_CONTEXT = new InjectionToken<SngSearchInputContext>('SNG_SEARCH_INPUT_CONTEXT');
