/**
 * @fileoverview Column ordering feature for sng-table-core
 *
 * Provides column reordering functionality via drag-and-drop or programmatic API.
 */

import {
  Column,
  ColumnOrderState,
  Updater,
  functionalUpdate,
  TableFeature,
  ColumnPinningPosition,
} from '../core/types';

// ============================================================================
// COLUMN ORDERING FEATURE
// ============================================================================

/**
 * Create the column ordering feature
 */
export function createColumnOrderingFeature<TData>(): TableFeature<TData> {
  return {
    getInitialState: (initialState) => ({
      columnOrder: initialState?.columnOrder ?? [],
    }),

    createTable: (table) => {
      table.setColumnOrder = (updater: Updater<ColumnOrderState>) => {
        table.setState((prev) => ({
          ...prev,
          columnOrder: functionalUpdate(updater, prev.columnOrder),
        }));
        table.options.onColumnOrderChange?.(updater);
      };

      table.resetColumnOrder = (defaultState?: boolean) => {
        table.setColumnOrder?.(
          defaultState ? [] : (table.initialState.columnOrder ?? [])
        );
      };
    },

    createColumn: (column, table) => {
      // Add getCanDrag method to check if column can be reordered
      column.getCanDrag = () => {
        // Check column-level enableOrdering (defaults to true if not specified)
        const columnDef = column.columnDef;
        if (columnDef.enableOrdering === false) {
          return false;
        }
        // Check table-level enableColumnOrdering (defaults to true)
        if (table.options.enableColumnOrdering === false) {
          return false;
        }
        return true;
      };

      // Extend existing getIndex to respect column order
      const originalGetIndex = column.getIndex;

      column.getIndex = (position?: ColumnPinningPosition) => {
        const { columnOrder } = table.getState();

        // If no explicit order, use original behavior
        if (!columnOrder.length) {
          return originalGetIndex(position);
        }

        // Get ordered columns
        const orderedColumns = orderColumnsByState(
          table.getAllLeafColumns(),
          columnOrder
        );

        // Filter by position if specified
        let columns = orderedColumns;
        if (position === 'left') {
          columns = orderedColumns.filter((c) => c.getIsPinned?.() === 'left');
        } else if (position === 'right') {
          columns = orderedColumns.filter((c) => c.getIsPinned?.() === 'right');
        } else if (position === false) {
          columns = orderedColumns.filter((c) => !c.getIsPinned?.());
        }

        return columns.findIndex((c) => c.id === column.id);
      };
    },
  };
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Order columns by column order state
 */
function orderColumnsByState<TData>(
  columns: Column<TData, unknown>[],
  columnOrder: string[]
): Column<TData, unknown>[] {
  if (!columnOrder.length) return columns;

  const columnMap = new Map(columns.map((col) => [col.id, col]));
  const ordered: Column<TData, unknown>[] = [];

  // Add columns in specified order
  for (const id of columnOrder) {
    const col = columnMap.get(id);
    if (col) {
      ordered.push(col);
      columnMap.delete(id);
    }
  }

  // Add remaining columns
  for (const col of columnMap.values()) {
    ordered.push(col);
  }

  return ordered;
}

/**
 * Move a column to a new position in the order
 */
export function moveColumn(
  columnOrder: ColumnOrderState,
  columnId: string,
  targetIndex: number
): ColumnOrderState {
  const newOrder = columnOrder.filter((id) => id !== columnId);
  newOrder.splice(targetIndex, 0, columnId);
  return newOrder;
}

/**
 * Swap two columns in the order
 */
export function swapColumns(
  columnOrder: ColumnOrderState,
  columnIdA: string,
  columnIdB: string
): ColumnOrderState {
  const newOrder = [...columnOrder];
  const indexA = newOrder.indexOf(columnIdA);
  const indexB = newOrder.indexOf(columnIdB);

  if (indexA === -1 || indexB === -1) {
    return columnOrder;
  }

  newOrder[indexA] = columnIdB;
  newOrder[indexB] = columnIdA;

  return newOrder;
}
