/**
 * @fileoverview Pagination feature for sng-table-core
 *
 * Provides pagination functionality with support for:
 * - Page size control
 * - Page navigation
 * - Auto-reset on data/filter changes
 * - Manual pagination (server-side)
 */

import {
  Table,
  PaginationState,
  Updater,
  functionalUpdate,
  TableFeature,
} from '../core/types';

// ============================================================================
// PAGINATION FEATURE
// ============================================================================

/**
 * Create the pagination feature
 */
export function createPaginationFeature<TData>(): TableFeature<TData> {
  return {
    getInitialState: (initialState) => ({
      pagination: initialState?.pagination ?? {
        pageIndex: 0,
        pageSize: 10,
      },
    }),

    getDefaultOptions: (_table) => ({
      autoResetPageIndex: true,
    }),

    createTable: (table) => {
      // Add table-level pagination APIs
      table.setPagination = (updater: Updater<PaginationState>) => {
        table.setState((prev) => ({
          ...prev,
          pagination: functionalUpdate(updater, prev.pagination),
        }));
        table.options.onPaginationChange?.(updater);
      };

      table.resetPagination = (defaultState?: boolean) => {
        table.setPagination?.(
          defaultState
            ? { pageIndex: 0, pageSize: 10 }
            : (table.initialState.pagination ?? { pageIndex: 0, pageSize: 10 })
        );
      };

      table.setPageIndex = (updater: Updater<number>) => {
        table.setPagination?.((prev) => ({
          ...prev,
          pageIndex: functionalUpdate(updater, prev.pageIndex),
        }));
      };

      table.setPageSize = (updater: Updater<number>) => {
        table.setPagination?.((prev) => {
          const newPageSize = functionalUpdate(updater, prev.pageSize);
          // Adjust page index to keep showing similar data
          const topRowIndex = prev.pageIndex * prev.pageSize;
          const newPageIndex = Math.floor(topRowIndex / newPageSize);

          return {
            pageIndex: newPageIndex,
            pageSize: newPageSize,
          };
        });
      };

      table.getPageCount = () => getPageCount(table);

      table.getCanPreviousPage = () => {
        const { pageIndex } = table.getState().pagination;
        return pageIndex > 0;
      };

      table.getCanNextPage = () => {
        const { pageIndex } = table.getState().pagination;
        const pageCount = table.getPageCount?.() ?? 1;
        return pageIndex < pageCount - 1;
      };

      table.previousPage = () => {
        table.setPageIndex?.((prev) => Math.max(0, prev - 1));
      };

      table.nextPage = () => {
        const pageCount = table.getPageCount?.() ?? 1;
        table.setPageIndex?.((prev) => Math.min(pageCount - 1, prev + 1));
      };

      table.firstPage = () => {
        table.setPageIndex?.(0);
      };

      table.lastPage = () => {
        const pageCount = table.getPageCount?.() ?? 1;
        table.setPageIndex?.(Math.max(0, pageCount - 1));
      };

      table.getPageOptions = () => {
        const pageCount = table.getPageCount?.() ?? 1;
        return Array.from({ length: pageCount }, (_, i) => i);
      };
    },
  };
}

// ============================================================================
// PAGINATION HELPERS
// ============================================================================

/**
 * Get total page count
 */
function getPageCount<TData>(table: Table<TData>): number {
  const { pageCount, manualPagination } = table.options;

  // Manual pagination with explicit page count
  if (manualPagination && pageCount !== undefined) {
    return Math.max(0, pageCount);
  }

  // Calculate from row count
  const { pageSize } = table.getState().pagination;

  // Get the pre-paginated row model
  const prePaginatedRowModel = getPrePaginatedRowModel(table);
  const rowCount = prePaginatedRowModel.rows.length;

  return Math.ceil(rowCount / pageSize);
}

/**
 * Get the row model before pagination
 */
function getPrePaginatedRowModel<TData>(table: Table<TData>) {
  // Pipeline: core -> filtered -> sorted -> (expanded) -> paginated
  // We want the model just before pagination

  // Try sorted first
  if (table.getSortedRowModel) {
    return table.getSortedRowModel();
  }

  // Then filtered
  if (table.getFilteredRowModel) {
    return table.getFilteredRowModel();
  }

  // Finally core
  return table.getCoreRowModel();
}

/**
 * Auto-reset page index when data changes
 * Called by the table when data/filters change
 */
export function maybeAutoResetPageIndex<TData>(table: Table<TData>): void {
  const { autoResetPageIndex } = table.options;

  if (autoResetPageIndex) {
    const { pageIndex } = table.getState().pagination;
    const pageCount = table.getPageCount?.() ?? 1;

    // If current page is now out of range, go to last valid page
    if (pageIndex >= pageCount && pageCount > 0) {
      table.setPageIndex?.(pageCount - 1);
    }
  }
}
