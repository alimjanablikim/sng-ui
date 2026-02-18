/**
 * @fileoverview Table head cell component
 *
 * The th element wrapper with styling.
 *
 * @example
 * ```html
 * <sng-table-head>Column Name</sng-table-head>
 *
 * <!-- With sorting -->
 * <sng-table-head (click)="column.toggleSorting()">
 *   Column Name
 *   @if (column.getIsSorted() === 'asc') { ↑ }
 *   @if (column.getIsSorted() === 'desc') { ↓ }
 * </sng-table-head>
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
 * Table head cell component (th)
 */
@Component({
  selector: 'sng-table-head',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    sng-table-head:has([role='checkbox']) {
      padding-right: 0;
    }

    sng-table-head > [role='checkbox'] {
      transform: translateY(2px);
    }
  `],
  host: {
    'style': 'display: table-cell',
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngTableHead {
  /**
   * Custom CSS classes
   */
  class = input<string>('');

  /**
   * Computed host classes
   */
  hostClasses = computed(() =>
    cn(
      'h-10 px-2 text-left align-middle font-medium text-muted-foreground',
      this.class()
    )
  );
}
