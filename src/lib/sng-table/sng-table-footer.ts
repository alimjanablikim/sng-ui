/**
 * @fileoverview Table footer component
 *
 * The tfoot element wrapper with styling.
 *
 * @example
 * ```html
 * <sng-table-footer>
 *   <sng-table-row>
 *     <sng-table-cell>Total</sng-table-cell>
 *     <sng-table-cell>$1,000.00</sng-table-cell>
 *   </sng-table-row>
 * </sng-table-footer>
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
 * Table footer component (tfoot)
 */
@Component({
  selector: 'sng-table-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    sng-table-footer > tr:last-child {
      border-bottom-width: 0;
    }
  `],
  host: {
    'style': 'display: table-footer-group',
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngTableFooter {
  /**
   * Custom CSS classes
   */
  class = input<string>('');

  /**
   * Computed host classes
   */
  hostClasses = computed(() =>
    cn(
      'border-t bg-muted/50 font-medium',
      this.class()
    )
  );
}
