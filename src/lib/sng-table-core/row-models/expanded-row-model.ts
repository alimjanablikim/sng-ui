/**
 * @fileoverview Expanded row model for sng-table-core
 *
 * Flattens expanded rows into a single list for rendering.
 */

import { Row, RowModel, Table, RowModelFn, ExpandedState } from '../core/types';
import { memo } from '../core/utils';

// ============================================================================
// EXPANDED ROW MODEL FACTORY
// ============================================================================

/**
 * Factory function to create the expanded row model
 *
 * @example
 * ```typescript
 * const table = createTable(() => ({
 *   data: myData,
 *   columns: myColumns,
 *   getCoreRowModel: getCoreRowModel(),
 *   getExpandedRowModel: getExpandedRowModel(),
 *   enableExpanding: true,
 * }));
 * ```
 */
export function getExpandedRowModel<TData>(): RowModelFn<TData> {
  return (table: Table<TData>) => {
    return memo(
      // Dependencies
      () => [
        table.getState().expanded,
        getPreExpandedRowModel(table),
      ],

      // Compute function
      () => {
        const { expanded } = table.getState();
        const preExpandedRowModel = getPreExpandedRowModel(table);

        // If no expansion state, return pre-expanded model
        if (!expanded || (typeof expanded === 'object' && !Object.keys(expanded).length)) {
          return preExpandedRowModel;
        }

        return buildExpandedRowModel(table, preExpandedRowModel, expanded);
      },

      // Options
      {
        debug: table.options.debugRows,
        debugLabel: 'getExpandedRowModel',
      }
    );
  };
}

// ============================================================================
// EXPANDED ROW MODEL BUILDER
// ============================================================================

/**
 * Build the expanded row model
 */
function buildExpandedRowModel<TData>(
  table: Table<TData>,
  rowModel: RowModel<TData>,
  expanded: ExpandedState
): RowModel<TData> {
  const { paginateExpandedRows = true } = table.options;

  // Expand rows
  const expandedRows = expandRows(rowModel.rows, expanded, paginateExpandedRows);

  // Flatten expanded rows
  const flatRows = flattenExpandedRows(expandedRows, expanded);

  // Build rows by ID lookup
  const rowsById: Record<string, Row<TData>> = {};
  for (const row of flatRows) {
    rowsById[row.id] = row;
  }

  return {
    rows: expandedRows,
    flatRows,
    rowsById,
  };
}

/**
 * Get the row model before expansion (sorted or filtered or core)
 */
function getPreExpandedRowModel<TData>(table: Table<TData>): RowModel<TData> {
  // Pipeline: core -> filtered -> sorted -> expanded -> paginated
  // We want the model just before expanded

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
 * Expand rows based on expanded state
 */
function expandRows<TData>(
  rows: Row<TData>[],
  expanded: ExpandedState,
  paginateExpandedRows: boolean
): Row<TData>[] {
  if (!paginateExpandedRows) {
    // If not paginating expanded rows, just return as-is
    // The pagination will handle expansion
    return rows;
  }

  // Otherwise, we need to include sub-rows in the row list for pagination
  const result: Row<TData>[] = [];

  function processRow(row: Row<TData>) {
    result.push(row);

    const isExpanded = expanded === true || (expanded as Record<string, boolean>)[row.id];

    if (isExpanded && row.subRows.length) {
      for (const subRow of row.subRows) {
        processRow(subRow);
      }
    }
  }

  for (const row of rows) {
    processRow(row);
  }

  return result;
}

/**
 * Flatten expanded rows
 */
function flattenExpandedRows<TData>(
  rows: Row<TData>[],
  expanded: ExpandedState
): Row<TData>[] {
  const result: Row<TData>[] = [];

  function processRow(row: Row<TData>) {
    result.push(row);

    const isExpanded = expanded === true || (expanded as Record<string, boolean>)[row.id];

    if (isExpanded && row.subRows.length) {
      for (const subRow of row.subRows) {
        processRow(subRow);
      }
    }
  }

  for (const row of rows) {
    processRow(row);
  }

  return result;
}
