/**
 * @fileoverview Column visibility feature for sng-table-core
 *
 * Provides column show/hide functionality.
 */

import {
  ColumnVisibilityState,
  Updater,
  functionalUpdate,
  TableFeature,
} from '../core/types';

// ============================================================================
// COLUMN VISIBILITY FEATURE
// ============================================================================

/**
 * Create the column visibility feature
 */
export function createColumnVisibilityFeature<TData>(): TableFeature<TData> {
  return {
    getInitialState: (initialState) => ({
      columnVisibility: initialState?.columnVisibility ?? {},
    }),

    getDefaultOptions: (_table) => ({
      enableHiding: true,
    }),

    createTable: (table) => {
      // Add table-level visibility APIs
      table.setColumnVisibility = (updater: Updater<ColumnVisibilityState>) => {
        table.setState((prev) => ({
          ...prev,
          columnVisibility: functionalUpdate(updater, prev.columnVisibility),
        }));
        table.options.onColumnVisibilityChange?.(updater);
      };

      table.resetColumnVisibility = (defaultState?: boolean) => {
        table.setColumnVisibility?.(
          defaultState ? {} : (table.initialState.columnVisibility ?? {})
        );
      };

      table.toggleAllColumnsVisible = (value?: boolean) => {
        table.setColumnVisibility?.(() => {
          const showAll = value ?? !table.getIsAllColumnsVisible?.();
          const columns = table.getAllLeafColumns();

          if (showAll) {
            // Show all - return empty object (default is visible)
            return {};
          } else {
            // Hide all
            const visibility: ColumnVisibilityState = {};
            for (const column of columns) {
              if (column.getCanHide?.()) {
                visibility[column.id] = false;
              }
            }
            return visibility;
          }
        });
      };

      table.getIsAllColumnsVisible = () => {
        const columns = table.getAllLeafColumns();
        return columns.every((column) => column.getIsVisible?.() ?? true);
      };

      table.getIsSomeColumnsVisible = () => {
        const columns = table.getAllLeafColumns();
        return columns.some((column) => column.getIsVisible?.() ?? true);
      };

      table.getToggleAllColumnsVisibilityHandler = () => {
        return () => table.toggleAllColumnsVisible?.();
      };

      table.getVisibleFlatColumns = () => {
        return table.getAllFlatColumns().filter(
          (column) => column.getIsVisible?.() ?? true
        );
      };

      table.getVisibleLeafColumns = () => {
        return table.getAllLeafColumns().filter(
          (column) => column.getIsVisible?.() ?? true
        );
      };
    },

    createColumn: (column, table) => {
      column.getCanHide = () => {
        const { enableHiding } = table.options;
        const { enableHiding: columnEnableHiding } = column.columnDef;

        if (columnEnableHiding === false) return false;
        if (enableHiding === false) return false;

        return true;
      };

      column.getIsVisible = () => {
        const { columnVisibility } = table.getState();
        // Default is visible (true) if not in state
        return columnVisibility[column.id] ?? true;
      };

      column.toggleVisibility = (value?: boolean) => {
        if (!column.getCanHide?.()) return;

        const isVisible = value ?? !column.getIsVisible?.();

        table.setColumnVisibility?.((prev) => ({
          ...prev,
          [column.id]: isVisible,
        }));
      };

      column.getToggleVisibilityHandler = () => {
        return () => column.toggleVisibility?.();
      };
    },
  };
}
