/**
 * @fileoverview Row creation and management for sng-table-core
 */

import { Row, Table, Cell } from './types';
import { createCell } from './create-cell';
import { defaultGetRowId } from './utils';

// ============================================================================
// ROW CREATION
// ============================================================================

/**
 * Create a row instance from data
 */
export function createRow<TData>(
  table: Table<TData>,
  original: TData,
  index: number,
  depth: number,
  subRows: Row<TData>[],
  parentId?: string,
  parentRow?: Row<TData>
): Row<TData> {
  // Generate row ID (use parentRow if provided, otherwise don't look it up to avoid circular dependency)
  const id = getRowId(table, original, index, parentRow);

  // Create the row instance
  const row: Row<TData> = {
    id,
    index,
    original,
    depth,
    parentId,
    subRows,

    getValue: <TValue = unknown>(columnId: string) =>
      getRowValue<TData, TValue>(table, row, columnId),

    getUniqueValues: <TValue = unknown>(columnId: string) =>
      getRowUniqueValues<TData, TValue>(table, row, columnId),

    getCell: (columnId: string) => getCellForRow(table, row, columnId),

    getVisibleCells: () => getVisibleCellsForRow(table, row),

    getAllCells: () => getAllCellsForRow(table, row),

    getParentRow: () => getParentRow(table, row),

    getParentRows: () => getParentRows(table, row),

    getLeafRows: () => getLeafRows(row),
  };

  return row;
}

/**
 * Apply features to a row after creation
 * This is called after all rows are built to avoid circular dependencies
 */
export function applyFeaturesToRow<TData>(
  row: Row<TData>,
  table: Table<TData>
): void {
  const features = table.options._features ?? [];
  for (const feature of features) {
    if (feature.createRow) {
      feature.createRow(row, table);
    }
  }
}

/**
 * Get row ID using table's getRowId option or default
 */
function getRowId<TData>(
  table: Table<TData>,
  original: TData,
  index: number,
  parent?: Row<TData>
): string {
  const { getRowId: userGetRowId } = table.options;

  if (userGetRowId) {
    return userGetRowId(original, index, parent);
  }

  return defaultGetRowId(original, index, parent);
}

// ============================================================================
// ROW VALUE ACCESS
// ============================================================================

/**
 * Get a cell value for this row
 */
function getRowValue<TData, TValue>(
  table: Table<TData>,
  row: Row<TData>,
  columnId: string
): TValue {
  const column = table.getColumn(columnId);

  if (!column) {
    console.warn(`[sng-table] Column "${columnId}" not found`);
    return undefined as TValue;
  }

  const accessorFn = column.getAccessorFn();

  if (!accessorFn) {
    // Display/group column - no value
    return undefined as TValue;
  }

  return accessorFn(row.original, row.index) as TValue;
}

/**
 * Get unique values for a column from this row and all sub-rows
 */
function getRowUniqueValues<TData, TValue>(
  table: Table<TData>,
  row: Row<TData>,
  columnId: string
): TValue[] {
  const values = new Set<TValue>();

  // Add this row's value
  const value = row.getValue<TValue>(columnId);
  if (value !== undefined && value !== null) {
    values.add(value);
  }

  // Add sub-rows' values recursively
  for (const subRow of row.subRows) {
    for (const val of subRow.getUniqueValues<TValue>(columnId)) {
      values.add(val);
    }
  }

  return Array.from(values);
}

// ============================================================================
// ROW CELL ACCESS
// ============================================================================

// Cell cache per row to avoid recreating
const cellCache = new WeakMap<Row<unknown>, Map<string, Cell<unknown, unknown>>>();

/**
 * Get or create a cell for a row and column
 */
function getCellForRow<TData>(
  table: Table<TData>,
  row: Row<TData>,
  columnId: string
): Cell<TData, unknown> {
  // Get or create cache for this row
  let rowCache = cellCache.get(row as Row<unknown>);
  if (!rowCache) {
    rowCache = new Map();
    cellCache.set(row as Row<unknown>, rowCache);
  }

  // Check cache
  let cell = rowCache.get(columnId) as Cell<TData, unknown> | undefined;
  if (cell) {
    return cell;
  }

  // Get column
  const column = table.getColumn(columnId);
  if (!column) {
    throw new Error(`[sng-table] Column "${columnId}" not found`);
  }

  // Create cell
  cell = createCell(table, row, column);
  rowCache.set(columnId, cell as Cell<unknown, unknown>);

  return cell;
}

/**
 * Get all visible cells for a row
 */
function getVisibleCellsForRow<TData>(
  table: Table<TData>,
  row: Row<TData>
): Cell<TData, unknown>[] {
  const visibleColumns = table.getVisibleLeafColumns?.() ?? table.getAllLeafColumns();
  return visibleColumns.map((column) => getCellForRow(table, row, column.id));
}

/**
 * Get all cells for a row (including hidden)
 */
function getAllCellsForRow<TData>(
  table: Table<TData>,
  row: Row<TData>
): Cell<TData, unknown>[] {
  const allColumns = table.getAllLeafColumns();
  return allColumns.map((column) => getCellForRow(table, row, column.id));
}

// ============================================================================
// ROW HIERARCHY
// ============================================================================

/**
 * Get parent row
 */
function getParentRow<TData>(
  table: Table<TData>,
  row: Row<TData>
): Row<TData> | undefined {
  if (!row.parentId) {
    return undefined;
  }

  try {
    return table.getRow(row.parentId, true);
  } catch {
    return undefined;
  }
}

/**
 * Get all parent rows (from immediate parent to root)
 */
function getParentRows<TData>(
  table: Table<TData>,
  row: Row<TData>
): Row<TData>[] {
  const parents: Row<TData>[] = [];
  let current = row.getParentRow?.();

  while (current) {
    parents.push(current);
    current = current.getParentRow?.();
  }

  return parents;
}

/**
 * Get all leaf rows (rows without sub-rows) from this row's subtree
 */
function getLeafRows<TData>(row: Row<TData>): Row<TData>[] {
  if (!row.subRows.length) {
    return [row];
  }

  return row.subRows.flatMap((subRow) => getLeafRows(subRow));
}

// ============================================================================
// ROW BUILDING
// ============================================================================

/**
 * Build rows from data array
 */
export function buildRowsFromData<TData>(
  table: Table<TData>,
  data: TData[],
  depth = 0,
  parentRow?: Row<TData>
): Row<TData>[] {
  return data.map((originalRow, index) => {
    // Get sub-rows if hierarchical
    const getSubRows = table.options.getSubRows;
    const childData = getSubRows?.(originalRow, index) ?? [];

    // Create the row first so it can be passed to children
    const row = createRow(table, originalRow, index, depth, [], parentRow?.id, parentRow);

    // Recursively build sub-rows, passing the current row as parent
    const subRows = childData.length
      ? buildRowsFromData(table, childData, depth + 1, row)
      : [];

    // Update the row's subRows
    row.subRows = subRows;

    return row;
  });
}
