/**
 * @fileoverview Table row component
 *
 * The tr element wrapper with styling.
 *
 * @example
 * ```html
 * <sng-table-row>
 *   <sng-table-cell>Cell 1</sng-table-cell>
 *   <sng-table-cell>Cell 2</sng-table-cell>
 * </sng-table-row>
 *
 * <!-- With selected state -->
 * <sng-table-row [selected]="row.getIsSelected()">
 *   ...
 * </sng-table-row>
 * ```
 */

import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * Table row component (tr)
 */
@Component({
  selector: 'sng-table-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'style': 'display: table-row',
    '[class]': 'hostClasses()',
    '[attr.data-state]': 'selected() ? "selected" : null',
  },
  template: `<ng-content />`,
})
export class SngTableRow {
  /**
   * Custom CSS classes
   */
  class = input<string>('');

  /**
   * Whether this row is selected
   */
  selected = input<boolean>(false);

  /**
   * Computed host classes
   */
  hostClasses = computed(() =>
    cn(
      'border-b transition-colors',
      'h-[42px]', // Explicit height to prevent shrink when selected
      'hover:bg-muted/50',
      'data-[state=selected]:bg-muted',
      this.class()
    )
  );
}
