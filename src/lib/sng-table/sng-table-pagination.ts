/**
 * @fileoverview Table pagination component
 *
 * A pagination component designed specifically for data tables.
 * Provides two layouts: compact (icons only) and normal (text labels).
 * Optionally includes a page size selector.
 *
 * @example
 * ```html
 * <!-- Compact layout (default) -->
 * <sng-table-pagination
 *   [pageIndex]="pagination().pageIndex"
 *   [pageCount]="table.getPageCount()"
 *   [canPreviousPage]="table.getCanPreviousPage()"
 *   [canNextPage]="table.getCanNextPage()"
 *   (firstPage)="table.firstPage()"
 *   (previousPage)="table.previousPage()"
 *   (nextPage)="table.nextPage()"
 *   (lastPage)="table.lastPage()" />
 *
 * <!-- With page size selector -->
 * <sng-table-pagination
 *   [pageIndex]="pagination().pageIndex"
 *   [pageSize]="pagination().pageSize"
 *   [pageSizeOptions]="[5, 10, 20, 50]"
 *   [pageCount]="table.getPageCount()"
 *   (pageSizeChange)="setPageSize($event)"
 *   ... />
 *
 * <!-- Normal layout with text labels -->
 * <sng-table-pagination layout="normal" ... />
 * ```
 */

import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  output,
  computed,
} from '@angular/core';
import { cn } from './cn';
import { SngButton } from '../button';
import { SngSelect } from '../select/sng-select';
import { SngSelectItem } from '../select/sng-select-item';

/**
 * Pagination layout type - controls button structure and content.
 */
export type SngTablePaginationLayout = 'compact' | 'normal';

/**
 * Table pagination component with compact and normal variants.
 */
@Component({
  selector: 'sng-table-pagination',
  standalone: true,
  imports: [SngButton, SngSelect, SngSelectItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <!-- Page size selector (optional) -->
    @if (showPageSizeSelector()) {
      <div class="flex items-center gap-2 mr-4">
        <span class="text-sm text-muted-foreground whitespace-nowrap">{{ rowsLabel() }}</span>
        <sng-select
          class="w-[70px] h-8"
          [value]="pageSizeString()"
          (valueChange)="onPageSizeSelect($event)">
          @for (option of pageSizeOptions(); track option) {
            <sng-select-item [value]="option.toString()">{{ option }}</sng-select-item>
          }
        </sng-select>
      </div>
    }

    <!-- Compact layout: icons only with page in middle -->
    @if (layout() === 'compact') {
      <sng-button class="h-8 w-8 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
        [disabled]="!canPreviousPage()"
        (click)="firstPage.emit()">
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/>
        </svg>
      </sng-button>
      <sng-button class="h-8 w-8 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
        [disabled]="!canPreviousPage()"
        (click)="previousPage.emit()">
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </sng-button>
      <span class="flex h-8 min-w-[80px] items-center justify-center text-sm">
        {{ pageIndex() + 1 }} / {{ pageCount() }}
      </span>
      <sng-button class="h-8 w-8 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
        [disabled]="!canNextPage()"
        (click)="nextPage.emit()">
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </sng-button>
      <sng-button class="h-8 w-8 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
        [disabled]="!canNextPage()"
        (click)="lastPage.emit()">
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/>
        </svg>
      </sng-button>
    }

    <!-- Normal layout: text labels -->
    @if (layout() === 'normal') {
      <sng-button class="h-8 px-3 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
        [disabled]="!canPreviousPage()"
        (click)="firstPage.emit()">
        {{ firstLabel() }}
      </sng-button>
      <sng-button class="h-8 px-3 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
        [disabled]="!canPreviousPage()"
        (click)="previousPage.emit()">
        {{ previousLabel() }}
      </sng-button>
      <span class="flex min-w-[100px] items-center justify-center text-sm text-muted-foreground">
        {{ pageLabel() }} {{ pageIndex() + 1 }} {{ ofLabel() }} {{ pageCount() }}
      </span>
      <sng-button class="h-8 px-3 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
        [disabled]="!canNextPage()"
        (click)="nextPage.emit()">
        {{ nextLabel() }}
      </sng-button>
      <sng-button class="h-8 px-3 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
        [disabled]="!canNextPage()"
        (click)="lastPage.emit()">
        {{ lastLabel() }}
      </sng-button>
    }
  `,
})
export class SngTablePagination {
  /**
   * Pagination layout - changes button structure and content.
   * - 'compact': Icon buttons with page number in middle
   * - 'normal': Text label buttons with full labels
   *
   * This is a functional input affecting button structure, interaction UX, and content.
   * For color/spacing customization, use the `class` input with Tailwind classes.
   */
  layout = input<SngTablePaginationLayout>('compact');

  /**
   * Current page index (0-based).
   */
  pageIndex = input.required<number>();

  /**
   * Total number of pages.
   */
  pageCount = input.required<number>();

  /**
   * Whether there is a previous page available.
   */
  canPreviousPage = input<boolean>(true);

  /**
   * Whether there is a next page available.
   */
  canNextPage = input<boolean>(true);

  /** Custom CSS classes. */
  class = input<string>('');

  /** Label for the page size selector caption. */
  rowsLabel = input<string>('Rows');

  /** Label for the first-page button in normal layout. */
  firstLabel = input<string>('First');

  /** Label for the previous-page button in normal layout. */
  previousLabel = input<string>('Previous');

  /** Label for the next-page button in normal layout. */
  nextLabel = input<string>('Next');

  /** Label for the last-page button in normal layout. */
  lastLabel = input<string>('Last');

  /** Label prefix for current page text in normal layout. */
  pageLabel = input<string>('Page');

  /** Separator label for current page text in normal layout. */
  ofLabel = input<string>('of');

  /**
   * Emitted when first page button is clicked.
   */
  firstPage = output<void>();

  /**
   * Emitted when previous page button is clicked.
   */
  previousPage = output<void>();

  /**
   * Emitted when next page button is clicked.
   */
  nextPage = output<void>();

  /**
   * Emitted when last page button is clicked.
   */
  lastPage = output<void>();

  /**
   * Current page size.
   * Only used when pageSizeOptions is provided.
   */
  pageSize = input<number>();

  /**
   * Available page size options.
   * When provided, displays a page size selector dropdown.
   * @example [5, 10, 20, 50]
   */
  pageSizeOptions = input<number[]>();

  /**
   * Emitted when page size is changed via the dropdown.
   */
  pageSizeChange = output<number>();

  /** @internal */
  showPageSizeSelector = computed(() => {
    const options = this.pageSizeOptions();
    return options && options.length > 0;
  });

  /** @internal - Convert number to string for SngSelect */
  pageSizeString = computed(() => {
    const size = this.pageSize();
    return size !== undefined ? size.toString() : '';
  });

  /** @internal */
  onPageSizeSelect(value: string) {
    const newSize = parseInt(value, 10);
    if (!isNaN(newSize)) {
      this.pageSizeChange.emit(newSize);
    }
  }

  /** @internal */
  hostClasses = computed(() =>
    cn(
      'flex items-center justify-center gap-1',
      this.layout() === 'normal' && 'gap-2',
      this.class()
    )
  );
}
