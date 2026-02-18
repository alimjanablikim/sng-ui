/**
 * @fileoverview Core row model for sng-table-core
 *
 * The core row model is the foundation of all row processing.
 * It takes raw data and converts it into Row instances.
 */

import { Row, RowModel, Table, RowModelFn } from '../core/types';
import { buildRowsFromData, applyFeaturesToRow } from '../core/create-row';
import { memo, flattenBy } from '../core/utils';

// ============================================================================
// CORE ROW MODEL FACTORY
// ============================================================================

/**
 * Factory function to create the core row model
 *
 * @example
 * ```typescript
 * const table = createTable(() => ({
 *   data: myData,
 *   columns: myColumns,
 *   getCoreRowModel: getCoreRowModel(),
 * }));
 * ```
 */
export function getCoreRowModel<TData>(): RowModelFn<TData> {
  return (table: Table<TData>) => {
    return memo(
      // Dependencies - recompute when these change
      () => [table.options.data],

      // Compute function
      () => buildCoreRowModel(table),

      // Options
      {
        debug: table.options.debugRows,
        debugLabel: 'getCoreRowModel',
      }
    );
  };
}

// ============================================================================
// CORE ROW MODEL BUILDER
// ============================================================================

/**
 * Build the core row model from data
 */
function buildCoreRowModel<TData>(table: Table<TData>): RowModel<TData> {
  const { data } = table.options;

  // Build rows from data (without features applied yet)
  const rows = buildRowsFromData(table, data);

  // Flatten all rows (including sub-rows)
  const flatRows = flattenBy(rows, (row) =>
    row.subRows.length ? row.subRows : undefined
  );

  // Build rows by ID lookup
  const rowsById: Record<string, Row<TData>> = {};
  for (const row of flatRows) {
    rowsById[row.id] = row;
  }

  // Apply features to all rows AFTER they're all built
  // This prevents circular dependency during hierarchical row building
  for (const row of flatRows) {
    applyFeaturesToRow(row, table);
  }

  return {
    rows,
    flatRows,
    rowsById,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create an empty row model
 */
export function createEmptyRowModel<TData>(): RowModel<TData> {
  return {
    rows: [],
    flatRows: [],
    rowsById: {},
  };
}

/**
 * Filter rows while maintaining hierarchy
 */
export function filterRows<TData>(
  rows: Row<TData>[],
  filterFn: (row: Row<TData>) => boolean,
  options?: {
    filterFromLeafRows?: boolean;
    maxDepth?: number;
  }
): Row<TData>[] {
  const { filterFromLeafRows = false, maxDepth = 100 } = options ?? {};

  if (filterFromLeafRows) {
    return filterRowsFromLeaves(rows, filterFn, maxDepth);
  }

  return filterRowsFromRoot(rows, filterFn, maxDepth);
}

/**
 * Filter rows starting from root (parent-first)
 * If parent matches, include all children
 */
function filterRowsFromRoot<TData>(
  rows: Row<TData>[],
  filterFn: (row: Row<TData>) => boolean,
  maxDepth: number,
  currentDepth = 0
): Row<TData>[] {
  const result: Row<TData>[] = [];

  for (const row of rows) {
    const passes = filterFn(row);

    if (passes) {
      // Parent matches - include it with all sub-rows as-is
      result.push(row);
    } else if (currentDepth < maxDepth && row.subRows.length) {
      // Parent doesn't match, but check children
      const filteredSubRows = filterRowsFromRoot(
        row.subRows,
        filterFn,
        maxDepth,
        currentDepth + 1
      );

      if (filteredSubRows.length) {
        // Some children match - create a copy of row with filtered children
        result.push({
          ...row,
          subRows: filteredSubRows,
        });
      }
    }
  }

  return result;
}

/**
 * Filter rows starting from leaves (child-first)
 * Include parent if any child matches
 */
function filterRowsFromLeaves<TData>(
  rows: Row<TData>[],
  filterFn: (row: Row<TData>) => boolean,
  maxDepth: number,
  currentDepth = 0
): Row<TData>[] {
  const result: Row<TData>[] = [];

  for (const row of rows) {
    let filteredSubRows: Row<TData>[] = [];

    if (currentDepth < maxDepth && row.subRows.length) {
      // First, filter children
      filteredSubRows = filterRowsFromLeaves(
        row.subRows,
        filterFn,
        maxDepth,
        currentDepth + 1
      );
    }

    // Check if this row passes or has passing children
    const passes = filterFn(row);

    if (passes || filteredSubRows.length) {
      result.push({
        ...row,
        subRows: filteredSubRows,
      });
    }
  }

  return result;
}

/**
 * Sort rows while maintaining hierarchy
 */
export function sortRows<TData>(
  rows: Row<TData>[],
  sortFn: (a: Row<TData>, b: Row<TData>) => number
): Row<TData>[] {
  // Sort this level
  const sortedRows = [...rows].sort(sortFn);

  // Recursively sort sub-rows
  return sortedRows.map((row) => {
    if (row.subRows.length) {
      return {
        ...row,
        subRows: sortRows(row.subRows, sortFn),
      };
    }
    return row;
  });
}

/**
 * Paginate rows (flat - doesn't handle hierarchy specially)
 */
export function paginateRows<TData>(
  rows: Row<TData>[],
  pageIndex: number,
  pageSize: number
): Row<TData>[] {
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  return rows.slice(start, end);
}

/**
 * Expand rows - include sub-rows of expanded rows in the flat list
 */
export function expandRows<TData>(
  rows: Row<TData>[],
  isExpanded: (row: Row<TData>) => boolean
): Row<TData>[] {
  const result: Row<TData>[] = [];

  function addRow(row: Row<TData>) {
    result.push(row);

    if (isExpanded(row) && row.subRows.length) {
      for (const subRow of row.subRows) {
        addRow(subRow);
      }
    }
  }

  for (const row of rows) {
    addRow(row);
  }

  return result;
}
