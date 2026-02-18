/**
 * @fileoverview Column creation and management for sng-table-core
 */

import {
  Column,
  ColumnDef,
  Table,
  AccessorFn,
  ColumnPinningPosition,
} from './types';
import { flattenBy, getValueAtPath } from './utils';

// ============================================================================
// COLUMN CREATION
// ============================================================================

/**
 * Create a column instance from a column definition
 */
export function createColumn<TData, TValue = unknown>(
  table: Table<TData>,
  columnDef: ColumnDef<TData, TValue>,
  depth: number,
  parent?: Column<TData, unknown>,
  path: number[] = []
): Column<TData, TValue> {
  // Resolve column ID
  const id = resolveColumnId(columnDef, path);

  // Merge with default column options
  const resolvedDef = {
    ...table.options.defaultColumn,
    ...columnDef,
  } as ColumnDef<TData, TValue>;

  // Create the column instance
  const column: Column<TData, TValue> = {
    id,
    columnDef: resolvedDef,
    depth,
    parent,
    columns: [], // Will be populated for group columns

    getLeafColumns: () => getLeafColumns(column as Column<TData, unknown>),
    getFlatColumns: () => getFlatColumns(column as Column<TData, unknown>),
    getAccessorFn: () => getAccessorFn(column),
    getIndex: (position?: ColumnPinningPosition) =>
      getColumnIndex(table, column as Column<TData, unknown>, position),
  };

  // Recursively create child columns if this is a group column
  if (resolvedDef.columns?.length) {
    column.columns = resolvedDef.columns.map((childDef, childIndex) =>
      createColumn(table, childDef, depth + 1, column as Column<TData, unknown>, [...path, childIndex])
    );
  }

  return column;
}

/**
 * Resolve column ID from column definition
 */
function resolveColumnId<TData, TValue>(
  columnDef: ColumnDef<TData, TValue>,
  path: number[]
): string {
  // Explicit ID takes precedence
  if (columnDef.id) {
    return columnDef.id;
  }

  // Use accessor key as ID
  if (columnDef.accessorKey) {
    return columnDef.accessorKey;
  }

  // Use accessor function name if available
  if (columnDef.accessorFn) {
    if (columnDef.accessorFn.name) {
      return columnDef.accessorFn.name;
    }
  }

  // No ID can be determined - this is an error for non-group columns
  if (!columnDef.columns?.length) {
    console.warn(
      '[sng-table] Column definition requires either id, accessorKey, or accessorFn with a name:',
      columnDef
    );
    return `column_${path.join('_') || '0'}`;
  }

  // Group columns without explicit ID get a deterministic one.
  return `group_${path.join('_') || '0'}`;
}

/**
 * Get accessor function for a column
 */
function getAccessorFn<TData, TValue>(
  column: Column<TData, TValue>
): AccessorFn<TData, TValue> | undefined {
  const { accessorFn, accessorKey } = column.columnDef;

  // Direct accessor function
  if (accessorFn) {
    return accessorFn;
  }

  // Create accessor from key
  if (accessorKey) {
    // Handle nested keys (e.g., 'user.profile.name')
    if (accessorKey.includes('.')) {
      return (row: TData) =>
        getValueAtPath(row as Record<string, unknown>, accessorKey) as TValue;
    }

    // Simple key access
    return (row: TData) => (row as Record<string, unknown>)[accessorKey] as TValue;
  }

  // No accessor - this is a display/group column
  return undefined;
}

// ============================================================================
// COLUMN TRAVERSAL
// ============================================================================

/**
 * Get all leaf columns (columns without children) from this column's subtree
 */
function getLeafColumns<TData>(
  column: Column<TData, unknown>
): Column<TData, unknown>[] {
  if (!column.columns.length) {
    return [column];
  }

  return column.columns.flatMap((child) => getLeafColumns(child));
}

/**
 * Get all columns (including groups) flattened from this column's subtree
 */
function getFlatColumns<TData>(
  column: Column<TData, unknown>
): Column<TData, unknown>[] {
  return [column, ...column.columns.flatMap((child) => getFlatColumns(child))];
}

/**
 * Get column index among siblings (considering pinning position if specified)
 */
function getColumnIndex<TData>(
  table: Table<TData>,
  column: Column<TData, unknown>,
  position?: ColumnPinningPosition
): number {
  // Get the appropriate column list based on position
  let columns: Column<TData, unknown>[];

  if (position === 'left') {
    columns = table.getLeftVisibleLeafColumns?.() ?? [];
  } else if (position === 'right') {
    columns = table.getRightVisibleLeafColumns?.() ?? [];
  } else if (position === false) {
    columns = table.getCenterVisibleLeafColumns?.() ?? [];
  } else {
    // Default: use all visible leaf columns
    columns = table.getVisibleLeafColumns?.() ?? table.getAllLeafColumns();
  }

  return columns.findIndex((c) => c.id === column.id);
}

// ============================================================================
// TABLE COLUMN HELPERS
// ============================================================================

/**
 * Build all columns from column definitions
 */
export function buildColumns<TData>(
  table: Table<TData>,
  columnDefs: ColumnDef<TData, unknown>[]
): Column<TData, unknown>[] {
  return columnDefs.map((columnDef, columnIndex) =>
    createColumn(table, columnDef, 0, undefined, [columnIndex])
  );
}

/**
 * Get all columns from column tree
 */
export function getAllColumns<TData>(
  columns: Column<TData, unknown>[]
): Column<TData, unknown>[] {
  return columns;
}

/**
 * Get all columns flattened (including nested)
 */
export function getAllFlatColumns<TData>(
  columns: Column<TData, unknown>[]
): Column<TData, unknown>[] {
  return flattenBy(columns, (col) =>
    col.columns.length ? col.columns : undefined
  );
}

/**
 * Get all leaf columns (no children)
 */
export function getAllLeafColumns<TData>(
  columns: Column<TData, unknown>[]
): Column<TData, unknown>[] {
  return getAllFlatColumns(columns).filter((col) => !col.columns.length);
}

/**
 * Get column by ID from flat columns
 */
export function getColumnById<TData>(
  flatColumns: Column<TData, unknown>[],
  columnId: string
): Column<TData, unknown> | undefined {
  return flatColumns.find((col) => col.id === columnId);
}

/**
 * Order columns by column order state
 */
export function orderColumns<TData>(
  columns: Column<TData, unknown>[],
  columnOrder: string[]
): Column<TData, unknown>[] {
  if (!columnOrder.length) {
    return columns;
  }

  // Create a map for fast lookup
  const columnMap = new Map(columns.map((col) => [col.id, col]));

  // Build ordered array
  const ordered: Column<TData, unknown>[] = [];

  // First, add columns in specified order
  for (const id of columnOrder) {
    const col = columnMap.get(id);
    if (col) {
      ordered.push(col);
      columnMap.delete(id);
    }
  }

  // Then, add any remaining columns not in order
  for (const col of columnMap.values()) {
    ordered.push(col);
  }

  return ordered;
}
