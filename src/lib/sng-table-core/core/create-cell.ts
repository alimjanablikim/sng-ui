/**
 * @fileoverview Cell creation and management for sng-table-core
 */

import { Cell, CellContext, Column, Row, Table } from './types';

// ============================================================================
// CELL CREATION
// ============================================================================

/**
 * Create a cell instance for a row and column
 */
export function createCell<TData, TValue = unknown>(
  table: Table<TData>,
  row: Row<TData>,
  column: Column<TData, TValue>
): Cell<TData, TValue> {
  // Generate cell ID
  const id = `${row.id}_${column.id}`;

  // Create the cell instance
  const cell: Cell<TData, TValue> = {
    id,
    row,
    column,

    getValue: () => getCellValue(row, column),

    renderValue: () => getRenderValue(table, row, column),

    getContext: () => getCellContext(table, row, column, cell),
  };

  return cell;
}

// ============================================================================
// CELL VALUE ACCESS
// ============================================================================

/**
 * Get the raw value for a cell
 */
function getCellValue<TData, TValue>(
  row: Row<TData>,
  column: Column<TData, TValue>
): TValue {
  return row.getValue<TValue>(column.id);
}

/**
 * Get the rendered value for a cell
 * If column has a cell function, use it. Otherwise return raw value.
 */
function getRenderValue<TData, TValue>(
  table: Table<TData>,
  row: Row<TData>,
  column: Column<TData, TValue>
): unknown {
  const cellDef = column.columnDef.cell;

  // No cell renderer - return raw value
  if (cellDef === undefined) {
    return row.getValue<TValue>(column.id);
  }

  // String cell - return it directly
  if (typeof cellDef === 'string') {
    return cellDef;
  }

  // Function cell - call it with context
  // Note: The actual rendering happens in FlexRender, here we just prepare
  // This function returns the raw value, FlexRender handles the cell function
  return row.getValue<TValue>(column.id);
}

// ============================================================================
// CELL CONTEXT
// ============================================================================

/**
 * Create the cell context for rendering
 */
function getCellContext<TData, TValue>(
  table: Table<TData>,
  row: Row<TData>,
  column: Column<TData, TValue>,
  cell: Cell<TData, TValue>
): CellContext<TData, TValue> {
  return {
    table,
    column,
    row,
    cell,
    getValue: () => cell.getValue(),
    renderValue: () => cell.renderValue(),
  };
}

// ============================================================================
// CELL HELPERS
// ============================================================================

/**
 * Get all cells for a list of rows and columns
 */
export function getCells<TData>(
  table: Table<TData>,
  rows: Row<TData>[],
  columns: Column<TData, unknown>[]
): Cell<TData, unknown>[][] {
  return rows.map((row) =>
    columns.map((column) => createCell(table, row, column))
  );
}
