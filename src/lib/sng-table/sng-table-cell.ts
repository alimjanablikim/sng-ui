/**
 * @fileoverview Table cell component
 *
 * The td element wrapper with styling.
 *
 * @example
 * ```html
 * <sng-table-cell>Cell content</sng-table-cell>
 *
 * <!-- With custom alignment -->
 * <sng-table-cell class="text-right">$100.00</sng-table-cell>
 * ```
 */

import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from './cn';

/**
 * Table cell component (td)
 */
@Component({
  selector: 'sng-table-cell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    sng-table-cell:has([role='checkbox']) {
      padding-right: 0;
    }

    sng-table-cell > [role='checkbox'] {
      transform: translateY(2px);
    }
  `],
  host: {
    'style': 'display: table-cell',
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngTableCell {
  /**
   * Custom CSS classes
   */
  class = input<string>('');

  /**
   * Computed host classes
   */
  hostClasses = computed(() =>
    cn(
      'p-2 align-middle',
      this.class()
    )
  );
}
