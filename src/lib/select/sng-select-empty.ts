import {
  Component,
  input,
  computed,
  inject,
  forwardRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SngSelect } from './sng-select';
import { cn } from './cn';

/**
 * Displays a message when no items match the search query in a searchable select.
 *
 * @example
 * ```html
 * <sng-select searchable [(value)]="selected" placeholder="Select...">
 *   <sng-select-empty>No results found.</sng-select-empty>
 *   <sng-select-item value="apple">Apple</sng-select-item>
 * </sng-select>
 * ```
 */
@Component({
  selector: 'sng-select-empty',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[class.hidden]': 'shouldHide()',
  },
  template: `<ng-content />`,
})
export class SngSelectEmpty {
  private select = inject(forwardRef(() => SngSelect), { optional: true });

  /** Custom CSS classes. */
  class = input<string>('');

  shouldHide = computed(() => {
    const query = this.select?.searchQuery() ?? '';
    const visibleCount = this.select?.visibleItemCount() ?? 0;
    return !query || visibleCount > 0;
  });

  hostClasses = computed(() =>
    cn('block py-6 text-center text-sm text-muted-foreground', this.class())
  );
}
