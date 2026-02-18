/**
 * @fileoverview Row selection feature for sng-table-core
 *
 * Provides row selection functionality with support for:
 * - Single and multi-row selection
 * - Sub-row selection
 * - Select all (page or all rows)
 */

import {
  Table,
  Row,
  RowSelectionState,
  Updater,
  functionalUpdate,
  TableFeature,
  RowModel,
} from '../core/types';

// ============================================================================
// ROW SELECTION FEATURE
// ============================================================================

/**
 * Create the row selection feature
 */
export function createRowSelectionFeature<TData>(): TableFeature<TData> {
  return {
    getInitialState: (initialState) => ({
      rowSelection: initialState?.rowSelection ?? {},
    }),

    getDefaultOptions: (_table) => ({
      enableRowSelection: true,
      enableMultiRowSelection: true,
      enableSubRowSelection: true,
    }),

    createTable: (table) => {
      // Add table-level selection APIs
      table.setRowSelection = (updater: Updater<RowSelectionState>) => {
        table.setState((prev) => ({
          ...prev,
          rowSelection: functionalUpdate(updater, prev.rowSelection),
        }));
        table.options.onRowSelectionChange?.(updater);
      };

      table.resetRowSelection = (defaultState?: boolean) => {
        table.setRowSelection?.(
          defaultState ? {} : (table.initialState.rowSelection ?? {})
        );
      };

      table.toggleAllRowsSelected = (value?: boolean) => {
        table.setRowSelection?.((_prev) => {
          const selectAll = value ?? !table.getIsAllRowsSelected?.();

          if (selectAll) {
            // Select all rows
            const newSelection: RowSelectionState = {};
            const rows = table.getRowModel().flatRows;

            for (const row of rows) {
              if (canRowBeSelected(row, table)) {
                newSelection[row.id] = true;
              }
            }

            return newSelection;
          } else {
            // Deselect all
            return {};
          }
        });
      };

      table.toggleAllPageRowsSelected = (value?: boolean) => {
        table.setRowSelection?.((prev) => {
          const selectAll = value ?? !table.getIsAllPageRowsSelected?.();
          const pageRows = table.getRowModel().rows;
          const newSelection = { ...prev };

          for (const row of pageRows) {
            if (canRowBeSelected(row, table)) {
              if (selectAll) {
                newSelection[row.id] = true;
              } else {
                delete newSelection[row.id];
              }
            }
          }

          return newSelection;
        });
      };

      table.getIsAllRowsSelected = () => {
        const rows = table.getRowModel().flatRows;
        const { rowSelection } = table.getState();

        if (!rows.length) return false;

        return rows.every(
          (row) => !canRowBeSelected(row, table) || rowSelection[row.id]
        );
      };

      table.getIsAllPageRowsSelected = () => {
        const pageRows = table.getRowModel().rows;
        const { rowSelection } = table.getState();

        if (!pageRows.length) return false;

        return pageRows.every(
          (row) => !canRowBeSelected(row, table) || rowSelection[row.id]
        );
      };

      table.getIsSomeRowsSelected = () => {
        const { rowSelection } = table.getState();
        return Object.keys(rowSelection).length > 0 && !table.getIsAllRowsSelected!();
      };

      table.getIsSomePageRowsSelected = () => {
        return !table.getIsAllPageRowsSelected!() &&
          table.getRowModel().rows.some(
            (row) => canRowBeSelected(row, table) && table.getState().rowSelection[row.id]
          );
      };

      table.getToggleAllRowsSelectedHandler = () => {
        return () => table.toggleAllRowsSelected?.();
      };

      table.getToggleAllPageRowsSelectedHandler = () => {
        return () => table.toggleAllPageRowsSelected?.();
      };

      table.getSelectedRowModel = () => {
        const { rowSelection } = table.getState();
        return getSelectedRowModel(table.getRowModel(), rowSelection);
      };

      table.getFilteredSelectedRowModel = () => {
        const { rowSelection } = table.getState();
        const filteredModel = table.getFilteredRowModel?.() ?? table.getCoreRowModel();
        return getSelectedRowModel(filteredModel, rowSelection);
      };

      table.getGroupedSelectedRowModel = () => {
        const { rowSelection } = table.getState();
        const groupedModel = table.getGroupedRowModel?.() ?? table.getCoreRowModel();
        return getSelectedRowModel(groupedModel, rowSelection);
      };
    },

    createRow: (row, table) => {
      row.getIsSelected = () => {
        const { rowSelection } = table.getState();
        return !!rowSelection[row.id];
      };

      row.getIsSomeSelected = () => {
        if (!row.subRows.length) return false;
        const { rowSelection } = table.getState();
        return row.subRows.some((subRow) => rowSelection[subRow.id]);
      };

      row.getIsAllSubRowsSelected = () => {
        if (!row.subRows.length) return false;
        const { rowSelection } = table.getState();
        return row.subRows.every((subRow) =>
          !canRowBeSelected(subRow, table) || rowSelection[subRow.id]
        );
      };

      row.getCanSelect = () => canRowBeSelected(row, table);

      row.getCanMultiSelect = () => canMultiSelect(row, table);

      row.getCanSelectSubRows = () => canSelectSubRows(row, table);

      row.toggleSelected = (value?: boolean, opts?: { selectChildren?: boolean }) => {
        const isSelected = value ?? !row.getIsSelected?.();

        table.setRowSelection?.((prev) => {
          const newSelection = { ...prev };

          if (isSelected) {
            newSelection[row.id] = true;
          } else {
            delete newSelection[row.id];
          }

          // Handle sub-row selection
          if (opts?.selectChildren !== false && row.getCanSelectSubRows?.()) {
            selectSubRows(row, newSelection, isSelected, table);
          }

          return newSelection;
        });
      };

      row.getToggleSelectedHandler = () => {
        return () => row.toggleSelected?.();
      };
    },
  };
}

// ============================================================================
// ROW SELECTION HELPERS
// ============================================================================

/**
 * Check if a row can be selected
 */
function canRowBeSelected<TData>(row: Row<TData>, table: Table<TData>): boolean {
  const { enableRowSelection } = table.options;

  if (enableRowSelection === false) return false;
  if (typeof enableRowSelection === 'function') {
    return enableRowSelection(row);
  }

  return true;
}

/**
 * Check if multi-select is enabled for a row
 */
function canMultiSelect<TData>(row: Row<TData>, table: Table<TData>): boolean {
  const { enableMultiRowSelection } = table.options;

  if (enableMultiRowSelection === false) return false;
  if (typeof enableMultiRowSelection === 'function') {
    return enableMultiRowSelection(row);
  }

  return true;
}

/**
 * Check if sub-row selection is enabled
 */
function canSelectSubRows<TData>(row: Row<TData>, table: Table<TData>): boolean {
  const { enableSubRowSelection } = table.options;

  if (enableSubRowSelection === false) return false;
  if (typeof enableSubRowSelection === 'function') {
    return enableSubRowSelection(row);
  }

  return true;
}

/**
 * Select/deselect sub-rows recursively
 */
function selectSubRows<TData>(
  row: Row<TData>,
  selection: RowSelectionState,
  isSelected: boolean,
  table: Table<TData>
): void {
  for (const subRow of row.subRows) {
    if (canRowBeSelected(subRow, table)) {
      if (isSelected) {
        selection[subRow.id] = true;
      } else {
        delete selection[subRow.id];
      }
    }

    if (subRow.subRows.length) {
      selectSubRows(subRow, selection, isSelected, table);
    }
  }
}

/**
 * Build a row model with only selected rows
 */
function getSelectedRowModel<TData>(
  rowModel: RowModel<TData>,
  rowSelection: RowSelectionState
): RowModel<TData> {
  const rows = rowModel.rows.filter((row) => rowSelection[row.id]);
  const flatRows = rowModel.flatRows.filter((row) => rowSelection[row.id]);

  const rowsById: Record<string, Row<TData>> = {};
  for (const row of flatRows) {
    rowsById[row.id] = row;
  }

  return { rows, flatRows, rowsById };
}
