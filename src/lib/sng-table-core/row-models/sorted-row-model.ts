/**
 * @fileoverview Sorted row model for sng-table-core
 *
 * Applies sorting to rows based on the current sorting state.
 * Supports multi-column sorting with priority order.
 */

import { Row, RowModel, Table, RowModelFn } from '../core/types';
import { memo } from '../core/utils';

// ============================================================================
// SORTED ROW MODEL FACTORY
// ============================================================================

/**
 * Factory function to create the sorted row model
 *
 * @example
 * ```typescript
 * const table = createTable(() => ({
 *   data: myData,
 *   columns: myColumns,
 *   getCoreRowModel: getCoreRowModel(),
 *   getSortedRowModel: getSortedRowModel(),
 *   enableSorting: true,
 * }));
 * ```
 */
export function getSortedRowModel<TData>(): RowModelFn<TData> {
  return (table: Table<TData>) => {
    return memo(
      // Dependencies - recompute when these change
      () => [
        table.getState().sorting,
        table.getFilteredRowModel?.() ?? table.getCoreRowModel(),
      ],

      // Compute function
      () => {
        const { sorting } = table.getState();

        // Get the pre-sorted row model (filtered or core)
        const preSortedRowModel =
          table.getFilteredRowModel?.() ?? table.getCoreRowModel();

        // If no sorting, return as-is
        if (!sorting.length) {
          return preSortedRowModel;
        }

        return buildSortedRowModel(table, preSortedRowModel, sorting);
      },

      // Options
      {
        debug: table.options.debugRows,
        debugLabel: 'getSortedRowModel',
      }
    );
  };
}

// ============================================================================
// SORTED ROW MODEL BUILDER
// ============================================================================

/**
 * Build the sorted row model
 */
function buildSortedRowModel<TData>(
  table: Table<TData>,
  rowModel: RowModel<TData>,
  sorting: { id: string; desc: boolean }[]
): RowModel<TData> {
  // Sort rows recursively (maintains hierarchy)
  const sortedRows = sortRowsRecursive(table, rowModel.rows, sorting);

  // Flatten sorted rows
  const flatRows = flattenRows(sortedRows);

  // Build rows by ID lookup
  const rowsById: Record<string, Row<TData>> = {};
  for (const row of flatRows) {
    rowsById[row.id] = row;
  }

  return {
    rows: sortedRows,
    flatRows,
    rowsById,
  };
}

/**
 * Sort rows recursively, maintaining hierarchy
 */
function sortRowsRecursive<TData>(
  table: Table<TData>,
  rows: Row<TData>[],
  sorting: { id: string; desc: boolean }[]
): Row<TData>[] {
  // Create sorting comparator
  const comparator = createSortingComparator(table, sorting);

  // Sort this level
  const sortedRows = [...rows].sort(comparator);

  // Recursively sort sub-rows
  return sortedRows.map((row) => {
    if (row.subRows.length) {
      return {
        ...row,
        subRows: sortRowsRecursive(table, row.subRows, sorting),
      };
    }
    return row;
  });
}

/**
 * Create a comparator function for sorting rows
 */
function createSortingComparator<TData>(
  table: Table<TData>,
  sorting: { id: string; desc: boolean }[]
): (a: Row<TData>, b: Row<TData>) => number {
  return (rowA: Row<TData>, rowB: Row<TData>): number => {
    // Compare by each sort column in priority order
    for (const sort of sorting) {
      const column = table.getColumn(sort.id);

      if (!column) {
        continue;
      }

      const sortingFn = column.getSortingFn?.();

      if (!sortingFn) {
        continue;
      }

      // Get comparison result
      let comparison = sortingFn(rowA, rowB, sort.id);

      // Handle undefined values placement
      const sortUndefined = column.columnDef.sortUndefined;
      if (sortUndefined !== false) {
        const aValue = rowA.getValue(sort.id);
        const bValue = rowB.getValue(sort.id);
        const aUndefined = aValue === undefined || aValue === null;
        const bUndefined = bValue === undefined || bValue === null;

        if (aUndefined && bUndefined) {
          comparison = 0;
        } else if (aUndefined) {
          comparison = sortUndefined === 'first' || sortUndefined === -1 ? -1 : 1;
        } else if (bUndefined) {
          comparison = sortUndefined === 'first' || sortUndefined === -1 ? 1 : -1;
        }
      }

      // If not equal, return result (with direction applied)
      if (comparison !== 0) {
        // Invert if needed
        if (column.columnDef.invertSorting) {
          comparison = -comparison;
        }

        // Apply sort direction
        return sort.desc ? -comparison : comparison;
      }
    }

    // All comparisons equal - maintain original order
    return 0;
  };
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
