/**
 * @fileoverview Row pinning feature for sng-table-core
 *
 * Provides row pinning (top/bottom sticky rows) functionality.
 */

import {
  Row,
  RowPinningState,
  RowPinningPosition,
  Updater,
  functionalUpdate,
  TableFeature,
} from '../core/types';

// ============================================================================
// ROW PINNING FEATURE
// ============================================================================

/**
 * Create the row pinning feature
 */
export function createRowPinningFeature<TData>(): TableFeature<TData> {
  return {
    getInitialState: (initialState) => ({
      rowPinning: initialState?.rowPinning ?? {
        top: [],
        bottom: [],
      },
    }),

    getDefaultOptions: (_table) => ({
      enableRowPinning: true,
      keepPinnedRows: true,
    }),

    createTable: (table) => {
      table.setRowPinning = (updater: Updater<RowPinningState>) => {
        table.setState((prev) => ({
          ...prev,
          rowPinning: functionalUpdate(updater, prev.rowPinning),
        }));
        table.options.onRowPinningChange?.(updater);
      };

      table.resetRowPinning = (defaultState?: boolean) => {
        table.setRowPinning?.(
          defaultState
            ? { top: [], bottom: [] }
            : (table.initialState.rowPinning ?? { top: [], bottom: [] })
        );
      };

      table.getIsSomeRowsPinned = (position?: RowPinningPosition) => {
        const { rowPinning } = table.getState();

        if (position === 'top') {
          return (rowPinning.top?.length ?? 0) > 0;
        }
        if (position === 'bottom') {
          return (rowPinning.bottom?.length ?? 0) > 0;
        }

        return (
          (rowPinning.top?.length ?? 0) > 0 ||
          (rowPinning.bottom?.length ?? 0) > 0
        );
      };

      table.getTopRows = () => {
        const { rowPinning } = table.getState();
        const topIds = rowPinning.top ?? [];
        const { keepPinnedRows } = table.options;

        // Get rows from appropriate model
        const rowModel = keepPinnedRows
          ? table.getCoreRowModel()
          : table.getRowModel();

        return topIds
          .map((id) => rowModel.rowsById[id])
          .filter(Boolean) as Row<TData>[];
      };

      table.getBottomRows = () => {
        const { rowPinning } = table.getState();
        const bottomIds = rowPinning.bottom ?? [];
        const { keepPinnedRows } = table.options;

        // Get rows from appropriate model
        const rowModel = keepPinnedRows
          ? table.getCoreRowModel()
          : table.getRowModel();

        return bottomIds
          .map((id) => rowModel.rowsById[id])
          .filter(Boolean) as Row<TData>[];
      };

      table.getCenterRows = () => {
        const { rowPinning } = table.getState();
        const pinnedIds = new Set([
          ...(rowPinning.top ?? []),
          ...(rowPinning.bottom ?? []),
        ]);

        return table.getRowModel().rows.filter((row) => !pinnedIds.has(row.id));
      };
    },

    createRow: (row, table) => {
      row.getCanPin = () => {
        const { enableRowPinning } = table.options;

        if (enableRowPinning === false) return false;
        if (typeof enableRowPinning === 'function') {
          return enableRowPinning(row);
        }

        return true;
      };

      row.getIsPinned = (): RowPinningPosition => {
        const { rowPinning } = table.getState();

        if (rowPinning.top?.includes(row.id)) {
          return 'top';
        }
        if (rowPinning.bottom?.includes(row.id)) {
          return 'bottom';
        }

        return false;
      };

      row.getPinnedIndex = () => {
        const position = row.getIsPinned?.();
        if (!position) return -1;

        const { rowPinning } = table.getState();
        const pinnedIds = position === 'top'
          ? rowPinning.top ?? []
          : rowPinning.bottom ?? [];

        return pinnedIds.indexOf(row.id);
      };

      row.pin = (
        position: RowPinningPosition,
        includeLeafRows?: boolean,
        includeParentRows?: boolean
      ) => {
        if (!row.getCanPin?.()) return;

        // Collect row IDs to pin
        const rowIds = new Set<string>([row.id]);

        // Include leaf rows
        if (includeLeafRows && row.subRows.length) {
          const leafRows = row.getLeafRows?.() ?? [];
          for (const leafRow of leafRows) {
            if (leafRow.getCanPin?.()) {
              rowIds.add(leafRow.id);
            }
          }
        }

        // Include parent rows
        if (includeParentRows) {
          const parentRows = row.getParentRows?.() ?? [];
          for (const parentRow of parentRows) {
            if (parentRow.getCanPin?.()) {
              rowIds.add(parentRow.id);
            }
          }
        }

        table.setRowPinning?.((prev) => {
          // Remove from both positions first
          const top = (prev.top ?? []).filter((id) => !rowIds.has(id));
          const bottom = (prev.bottom ?? []).filter((id) => !rowIds.has(id));

          // Add to new position
          if (position === 'top') {
            top.push(...rowIds);
          } else if (position === 'bottom') {
            bottom.push(...rowIds);
          }
          // If position is false, rows are unpinned (already removed above)

          return { top, bottom };
        });
      };
    },
  };
}
