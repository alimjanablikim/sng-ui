import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  contentChildren,
} from '@angular/core';
import { cn } from './cn';
import { SngSearchInputItem } from './sng-search-input-item';

/**
 * Groups related search items together with an optional heading.
 * Automatically hides when none of its items are visible (e.g. during filtering).
 *
 * @example
 * ```html
 * <sng-search-input-list>
 *   <sng-search-input-group heading="Suggestions">
 *     <sng-search-input-item>Calendar</sng-search-input-item>
 *     <sng-search-input-item>Search</sng-search-input-item>
 *   </sng-search-input-group>
 *   <sng-search-input-group heading="Settings">
 *     <sng-search-input-item>Profile</sng-search-input-item>
 *     <sng-search-input-item>Preferences</sng-search-input-item>
 *   </sng-search-input-group>
 * </sng-search-input-list>
 * ```
 */
@Component({
  selector: 'sng-search-input-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
    '[hidden]': '!hasVisibleItems()',
    'role': 'group',
  },
  template: `
    @if (heading()) {
      <div class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
        {{ heading() }}
      </div>
    }
    <ng-content />
  `,
})
export class SngSearchInputGroup {
  /**
   * Heading text displayed above the group items.
   */
  heading = input<string>('');

  /** Custom CSS classes. */
  class = input<string>('');

  /** @internal Query child items to track visibility. */
  private items = contentChildren(SngSearchInputItem, { descendants: true });

  /** Whether the group has at least one visible item. */
  hasVisibleItems = computed(() => {
    const items = this.items();
    if (items.length === 0) return true; // No items yet (initial render)
    return items.some(item => item.isVisible());
  });

  hostClasses = computed(() => cn('block overflow-hidden', this.class()));
}
