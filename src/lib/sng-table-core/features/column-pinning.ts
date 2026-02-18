/**
 * @fileoverview Column pinning feature for sng-table-core
 *
 * Provides column pinning (left/right sticky columns) functionality.
 */

import {
  Column,
  HeaderGroup,
  ColumnPinningState,
  ColumnPinningPosition,
  Updater,
  functionalUpdate,
  TableFeature,
} from '../core/types';

// ============================================================================
// COLUMN PINNING FEATURE
// ============================================================================

/**
 * Create the column pinning feature
 */
export function createColumnPinningFeature<TData>(): TableFeature<TData> {
  return {
    getInitialState: (initialState) => ({
      columnPinning: initialState?.columnPinning ?? {
        left: [],
        right: [],
      },
    }),

    getDefaultOptions: (_table) => ({
      enablePinning: true,
      enableColumnPinning: true,
    }),

    createTable: (table) => {
      table.setColumnPinning = (updater: Updater<ColumnPinningState>) => {
        table.setState((prev) => ({
          ...prev,
          columnPinning: functionalUpdate(updater, prev.columnPinning),
        }));
        table.options.onColumnPinningChange?.(updater);
      };

      table.resetColumnPinning = (defaultState?: boolean) => {
        table.setColumnPinning?.(
          defaultState
            ? { left: [], right: [] }
            : (table.initialState.columnPinning ?? { left: [], right: [] })
        );
      };

      table.getIsSomeColumnsPinned = (position?: ColumnPinningPosition) => {
        const { columnPinning } = table.getState();

        if (position === 'left') {
          return (columnPinning.left?.length ?? 0) > 0;
        }
        if (position === 'right') {
          return (columnPinning.right?.length ?? 0) > 0;
        }

        return (
          (columnPinning.left?.length ?? 0) > 0 ||
          (columnPinning.right?.length ?? 0) > 0
        );
      };

      table.getLeftLeafColumns = () => {
        const { columnPinning } = table.getState();
        const leftIds = columnPinning.left ?? [];
        return table.getAllLeafColumns().filter((col) => leftIds.includes(col.id));
      };

      table.getRightLeafColumns = () => {
        const { columnPinning } = table.getState();
        const rightIds = columnPinning.right ?? [];
        return table.getAllLeafColumns().filter((col) => rightIds.includes(col.id));
      };

      table.getCenterLeafColumns = () => {
        const { columnPinning } = table.getState();
        const pinnedIds = [
          ...(columnPinning.left ?? []),
          ...(columnPinning.right ?? []),
        ];
        return table.getAllLeafColumns().filter((col) => !pinnedIds.includes(col.id));
      };

      table.getLeftVisibleLeafColumns = () => {
        return table.getLeftLeafColumns?.()?.filter(
          (col) => col.getIsVisible?.() ?? true
        ) ?? [];
      };

      table.getRightVisibleLeafColumns = () => {
        return table.getRightLeafColumns?.()?.filter(
          (col) => col.getIsVisible?.() ?? true
        ) ?? [];
      };

      table.getCenterVisibleLeafColumns = () => {
        return table.getCenterLeafColumns?.()?.filter(
          (col) => col.getIsVisible?.() ?? true
        ) ?? [];
      };

      // Header groups by position
      table.getLeftHeaderGroups = () => {
        const leftColumns = table.getLeftLeafColumns?.() ?? [];
        return filterHeaderGroupsByColumns(table.getHeaderGroups(), leftColumns);
      };

      table.getRightHeaderGroups = () => {
        const rightColumns = table.getRightLeafColumns?.() ?? [];
        return filterHeaderGroupsByColumns(table.getHeaderGroups(), rightColumns);
      };

      table.getCenterHeaderGroups = () => {
        const centerColumns = table.getCenterLeafColumns?.() ?? [];
        return filterHeaderGroupsByColumns(table.getHeaderGroups(), centerColumns);
      };

      // Flat headers by position
      table.getLeftFlatHeaders = () => {
        return table.getLeftHeaderGroups?.()?.flatMap((g) => g.headers) ?? [];
      };

      table.getRightFlatHeaders = () => {
        return table.getRightHeaderGroups?.()?.flatMap((g) => g.headers) ?? [];
      };

      table.getCenterFlatHeaders = () => {
        return table.getCenterHeaderGroups?.()?.flatMap((g) => g.headers) ?? [];
      };
    },

    createColumn: (column, table) => {
      column.getCanPin = () => {
        const { enablePinning, enableColumnPinning } = table.options;
        const { enablePinning: columnEnablePinning } = column.columnDef;

        if (columnEnablePinning === false) return false;
        if (enableColumnPinning === false) return false;
        if (enablePinning === false) return false;

        return true;
      };

      column.getIsPinned = (): ColumnPinningPosition => {
        const { columnPinning } = table.getState();

        if (columnPinning.left?.includes(column.id)) {
          return 'left';
        }
        if (columnPinning.right?.includes(column.id)) {
          return 'right';
        }

        return false;
      };

      column.getPinnedIndex = () => {
        const position = column.getIsPinned?.();
        if (!position) return -1;

        const { columnPinning } = table.getState();
        const pinnedIds = position === 'left'
          ? columnPinning.left ?? []
          : columnPinning.right ?? [];

        return pinnedIds.indexOf(column.id);
      };

      column.pin = (position: ColumnPinningPosition) => {
        if (!column.getCanPin?.()) return;

        table.setColumnPinning?.((prev) => {
          const left = (prev.left ?? []).filter((id) => id !== column.id);
          const right = (prev.right ?? []).filter((id) => id !== column.id);

          if (position === 'left') {
            left.push(column.id);
          } else if (position === 'right') {
            right.push(column.id);
          }
          // If position is false, column is unpinned (already removed above)

          return { left, right };
        });
      };
    },
  };
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Filter header groups to only include headers for specified columns
 */
function filterHeaderGroupsByColumns<TData>(
  headerGroups: HeaderGroup<TData>[],
  columns: Column<TData, unknown>[]
): HeaderGroup<TData>[] {
  const columnIds = new Set(columns.map((col) => col.id));

  return headerGroups.map((group) => ({
    ...group,
    headers: group.headers.filter((header) => {
      // Check if this header or any of its leaf columns are in the set
      const leafColumns = header.column.getLeafColumns();
      return leafColumns.some((col) => columnIds.has(col.id));
    }),
  })).filter((group) => group.headers.length > 0);
}
