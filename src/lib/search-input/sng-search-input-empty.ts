import { Directive, input, computed, inject } from '@angular/core';
import { SNG_SEARCH_INPUT_CONTEXT } from './sng-search-input-context';
import { cn } from './cn';

/**
 * Displays a message when no search items match the current search query.
 * Automatically shows/hides based on search results.
 *
 * @example
 * ```html
 * <sng-search-input>
 *   <sng-search-input-list>
 *     <sng-search-input-item>Calendar</sng-search-input-item>
 *   </sng-search-input-list>
 *   <sng-search-input-empty>No results found.</sng-search-input-empty>
 * </sng-search-input>
 * ```
 */
@Directive({
  selector: 'sng-search-input-empty',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class SngSearchInputEmpty {
  private searchContext = inject(SNG_SEARCH_INPUT_CONTEXT);

  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() => {
    const hasQuery = this.searchContext.searchQuery().length > 0;
    const noResults = this.searchContext.visibleItemCount() === 0;
    const shouldHide = !hasQuery || !noResults;
    return cn(
      'py-6 text-center text-sm text-muted-foreground',
      shouldHide && 'hidden',
      this.class()
    );
  });
}
