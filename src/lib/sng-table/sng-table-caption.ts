/**
 * @fileoverview Table caption component
 *
 * The caption element wrapper with styling.
 *
 * @example
 * ```html
 * <sng-table>
 *   <sng-table-caption>A list of recent invoices</sng-table-caption>
 *   <sng-table-header>...</sng-table-header>
 *   <sng-table-body>...</sng-table-body>
 * </sng-table>
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
 * Table caption component
 */
@Component({
  selector: 'sng-table-caption',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'style': 'display: table-caption',
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngTableCaption {
  /**
   * Custom CSS classes
   */
  class = input<string>('');

  /**
   * Computed host classes
   */
  hostClasses = computed(() =>
    cn('mt-4 text-sm text-muted-foreground', this.class())
  );
}
