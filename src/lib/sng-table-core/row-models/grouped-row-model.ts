/**
 * @fileoverview Grouped row model for sng-table-core
 *
 * Groups rows by specified columns and calculates aggregations.
 */

import { Row, RowModel, Table, RowModelFn, GroupingState } from '../core/types';
import { memo } from '../core/utils';

// ============================================================================
// GROUPED ROW MODEL FACTORY
// ============================================================================

/**
 * Factory function to create the grouped row model
 *
 * @example
 * ```typescript
 * const table = createTable(() => ({
 *   data: myData,
 *   columns: myColumns,
 *   getCoreRowModel: getCoreRowModel(),
 *   getGroupedRowModel: getGroupedRowModel(),
 *   enableGrouping: true,
 * }));
 * ```
 */
export function getGroupedRowModel<TData>(): RowModelFn<TData> {
  return (table: Table<TData>) => {
    return memo(
      // Dependencies
      () => [
        table.getState().grouping,
        table.getCoreRowModel(),
      ],

      // Compute function
      () => {
        const { grouping } = table.getState();
        const coreRowModel = table.getCoreRowModel();

        // If no grouping, return core model
        if (!grouping.length) {
          return coreRowModel;
        }

        return buildGroupedRowModel(table, coreRowModel, grouping);
      },

      // Options
      {
        debug: table.options.debugRows,
        debugLabel: 'getGroupedRowModel',
      }
    );
  };
}

// ============================================================================
// GROUPED ROW MODEL BUILDER
// ============================================================================

/**
 * Build the grouped row model
 */
function buildGroupedRowModel<TData>(
  table: Table<TData>,
  rowModel: RowModel<TData>,
  grouping: GroupingState
): RowModel<TData> {
  // Group rows hierarchically
  const groupedRows = groupRowsRecursive(
    table,
    rowModel.rows,
    grouping,
    0
  );

  // Flatten grouped rows
  const flatRows = flattenGroupedRows(groupedRows);

  // Build rows by ID lookup
  const rowsById: Record<string, Row<TData>> = {};
  for (const row of flatRows) {
    rowsById[row.id] = row;
  }

  return {
    rows: groupedRows,
    flatRows,
    rowsById,
  };
}

/**
 * Group rows recursively by grouping columns
 */
function groupRowsRecursive<TData>(
  table: Table<TData>,
  rows: Row<TData>[],
  grouping: GroupingState,
  depth: number,
  parentId?: string
): Row<TData>[] {
  // No more grouping columns - return leaf rows
  if (depth >= grouping.length) {
    return rows;
  }

  const columnId = grouping[depth];
  const column = table.getColumn(columnId);

  if (!column) {
    return rows;
  }

  // Group rows by value
  const groups = new Map<unknown, Row<TData>[]>();

  for (const row of rows) {
    const value = row.getGroupingValue?.(columnId) ?? row.getValue(columnId);

    if (!groups.has(value)) {
      groups.set(value, []);
    }
    groups.get(value)!.push(row);
  }

  // Create grouped rows
  const groupedRows: Row<TData>[] = [];

  for (const [groupValue, groupRows] of groups) {
    // Generate a unique ID for this group
    const groupId = `${parentId ? parentId + '>' : ''}${columnId}:${String(groupValue)}`;

    // Recursively group sub-rows
    const subRows = groupRowsRecursive(
      table,
      groupRows,
      grouping,
      depth + 1,
      groupId
    );

    // Get leaf rows for aggregation
    const leafRows = getLeafRows(subRows);

    // Create the group row
    const groupRow = createGroupRow(
      table,
      groupId,
      groupRows[0], // Use first row as template
      depth,
      subRows,
      leafRows,
      columnId,
      groupValue,
      parentId
    );

    groupedRows.push(groupRow);
  }

  return groupedRows;
}

/**
 * Create a grouped row
 */
function createGroupRow<TData>(
  table: Table<TData>,
  id: string,
  templateRow: Row<TData>,
  depth: number,
  subRows: Row<TData>[],
  leafRows: Row<TData>[],
  groupingColumnId: string,
  groupingValue: unknown,
  parentId?: string
): Row<TData> {
  // Create aggregated values for each column
  const aggregatedValues: Record<string, unknown> = {};

  for (const column of table.getAllLeafColumns()) {
    const aggregationFn = column.getAggregationFn?.();
    if (aggregationFn) {
      aggregatedValues[column.id] = aggregationFn(column.id, leafRows, subRows);
    }
  }

  // Create the group row
  const groupRow: Row<TData> = {
    id,
    index: 0, // Group rows don't have a meaningful index
    original: templateRow.original, // Reference to first row's data
    depth,
    parentId,
    subRows,

    // Mark as grouped
    groupingColumnId,
    groupingValue,

    // Override getValue to return aggregated values
    getValue: <TValue = unknown>(columnId: string) => {
      // For the grouping column, return the group value
      if (columnId === groupingColumnId) {
        return groupingValue as TValue;
      }
      // For other columns, return aggregated value
      return aggregatedValues[columnId] as TValue;
    },

    getUniqueValues: <TValue = unknown>(columnId: string) => {
      const values = new Set<TValue>();
      for (const row of leafRows) {
        values.add(row.getValue<TValue>(columnId));
      }
      return Array.from(values);
    },

    // Delegate to table methods
    getCell: (columnId: string) => templateRow.getCell(columnId),
    getVisibleCells: () => templateRow.getVisibleCells(),
    getAllCells: () => templateRow.getAllCells(),

    // Group-specific methods
    getIsGrouped: () => true,
    getGroupingValue: (columnId: string) => {
      if (columnId === groupingColumnId) {
        return groupingValue;
      }
      return aggregatedValues[columnId];
    },

    getLeafRows: () => leafRows,
    getParentRows: () => {
      if (!parentId) return [];
      const parent = table.getRow(parentId, true);
      return parent ? [parent, ...(parent.getParentRows?.() ?? [])] : [];
    },
  };

  return groupRow;
}

/**
 * Get all leaf rows from grouped rows
 */
function getLeafRows<TData>(rows: Row<TData>[]): Row<TData>[] {
  const result: Row<TData>[] = [];

  function collectLeaves(row: Row<TData>) {
    if (!row.subRows.length || !row.groupingColumnId) {
      // This is a leaf row
      result.push(row);
    } else {
      // Recurse into sub-rows
      for (const subRow of row.subRows) {
        collectLeaves(subRow);
      }
    }
  }

  for (const row of rows) {
    collectLeaves(row);
  }

  return result;
}

/**
 * Flatten grouped rows
 */
function flattenGroupedRows<TData>(rows: Row<TData>[]): Row<TData>[] {
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
