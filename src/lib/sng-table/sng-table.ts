/**
 * @fileoverview Table wrapper component
 *
 * Provides a styled table container with responsive scrolling.
 *
 * @example
 * ```html
 * <sng-table>
 *   <sng-table-header>...</sng-table-header>
 *   <sng-table-body>...</sng-table-body>
 * </sng-table>
 * ```
 */

import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * Table container component
 *
 * Wraps the table in a scrollable container with proper styling.
 */
@Component({
  selector: 'sng-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'containerClasses()',
  },
  template: `
    <table [class]="tableClasses()">
      <ng-content />
    </table>
  `,
})
export class SngTable {
  /**
   * Custom CSS classes for the container
   */
  class = input<string>('');

  /**
   * Custom CSS classes for the table element
   */
  tableClass = input<string>('');

  /**
   * Computed container classes
   */
  containerClasses = computed(() =>
    cn('relative w-full overflow-auto', this.class())
  );

  /**
   * Computed table classes
   */
  tableClasses = computed(() =>
    cn('w-full caption-bottom text-sm', this.tableClass())
  );
}
