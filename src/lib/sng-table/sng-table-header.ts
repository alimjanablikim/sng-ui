/**
 * @fileoverview Table header component
 *
 * The thead element wrapper with styling.
 *
 * @example
 * ```html
 * <sng-table-header>
 *   <sng-table-row>
 *     <sng-table-head>Name</sng-table-head>
 *     <sng-table-head>Email</sng-table-head>
 *   </sng-table-row>
 * </sng-table-header>
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
 * Table header component (thead)
 */
@Component({
  selector: 'sng-table-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'style': 'display: table-header-group',
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngTableHeader {
  /**
   * Custom CSS classes
   */
  class = input<string>('');

  /**
   * Computed host classes
   */
  hostClasses = computed(() => cn(this.class()));
}
