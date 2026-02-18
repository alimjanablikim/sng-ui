/**
 * @fileoverview Paginated row model for sng-table-core
 *
 * Slices rows based on current pagination state.
 */

import { Row, RowModel, Table, RowModelFn } from '../core/types';
import { memo } from '../core/utils';

// ============================================================================
// PAGINATED ROW MODEL FACTORY
// ============================================================================

/**
 * Factory function to create the paginated row model
 *
 * @example
 * ```typescript
 * const table = createTable(() => ({
 *   data: myData,
 *   columns: myColumns,
 *   getCoreRowModel: getCoreRowModel(),
 *   getSortedRowModel: getSortedRowModel(),
 *   getPaginatedRowModel: getPaginatedRowModel(),
 * }));
 * ```
 */
export function getPaginatedRowModel<TData>(): RowModelFn<TData> {
  return (table: Table<TData>) => {
    return memo(
      // Dependencies - recompute when these change
      () => [
        table.getState().pagination,
        // Get the pre-paginated model
        getPrePaginatedRowModel(table),
      ],

      // Compute function
      () => {
        return buildPaginatedRowModel(table);
      },

      // Options
      {
        debug: table.options.debugRows,
        debugLabel: 'getPaginatedRowModel',
      }
    );
  };
}

// ============================================================================
// PAGINATED ROW MODEL BUILDER
// ============================================================================

/**
 * Build the paginated row model
 */
function buildPaginatedRowModel<TData>(table: Table<TData>): RowModel<TData> {
  const { pageIndex, pageSize } = table.getState().pagination;
  const prePaginatedRowModel = getPrePaginatedRowModel(table);

  // Manual pagination - assume all rows are already paginated server-side
  if (table.options.manualPagination) {
    return prePaginatedRowModel;
  }

  // Calculate slice range
  const start = pageIndex * pageSize;
  const end = start + pageSize;

  // Slice rows
  const paginatedRows = prePaginatedRowModel.rows.slice(start, end);

  // For flat rows, we need to flatten the paginated rows
  const flatRows = flattenRows(paginatedRows);

  // Build rows by ID lookup
  const rowsById: Record<string, Row<TData>> = {};
  for (const row of flatRows) {
    rowsById[row.id] = row;
  }

  return {
    rows: paginatedRows,
    flatRows,
    rowsById,
  };
}

/**
 * Get the row model before pagination (sorted or filtered or core)
 */
function getPrePaginatedRowModel<TData>(table: Table<TData>): RowModel<TData> {
  // Pipeline: core -> filtered -> sorted -> expanded -> paginated
  // We want the model just before pagination

  // Check expanded row model first (if expanding is used)
  if (table.getExpandedRowModel) {
    return table.getExpandedRowModel();
  }

  // Then sorted
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
 * Flatten rows including sub-rows
 */
function flattenRows<TData>(rows: Row<TData>[]): Row<TData>[] {
  const result: Row<TData>[] = [];

  function addRow(row: Row<TData>) {
    result.push(row);
    for (const subRow of row.subRows) {
      addRow(subRow);
    }
  }

  for (const row of rows) {
    addRow(row);
  }

  return result;
}
