/**
 * @fileoverview Table body component
 *
 * The tbody element wrapper with styling.
 *
 * @example
 * ```html
 * <sng-table-body>
 *   @for (row of rows; track row.id) {
 *     <sng-table-row>
 *       <sng-table-cell>{{ row.name }}</sng-table-cell>
 *       <sng-table-cell>{{ row.email }}</sng-table-cell>
 *     </sng-table-row>
 *   }
 * </sng-table-body>
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
 * Table body component (tbody)
 */
@Component({
  selector: 'sng-table-body',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      sng-table-body > sng-table-row:last-child {
        border-bottom-width: 0;
      }
    `,
  ],
  host: {
    'style': 'display: table-row-group',
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngTableBody {
  /**
   * Custom CSS classes
   */
  class = input<string>('');

  /**
   * Computed host classes
   */
  hostClasses = computed(() => cn(this.class()));
}
