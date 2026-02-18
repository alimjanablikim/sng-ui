/**
 * @fileoverview Row expanding feature for sng-table-core
 *
 * Provides row expand/collapse functionality for hierarchical data.
 */

import {
  ExpandedState,
  Updater,
  functionalUpdate,
  TableFeature,
} from '../core/types';

// ============================================================================
// ROW EXPANDING FEATURE
// ============================================================================

/**
 * Create the row expanding feature
 */
export function createRowExpandingFeature<TData>(): TableFeature<TData> {
  return {
    getInitialState: (initialState) => ({
      expanded: initialState?.expanded ?? {},
    }),

    getDefaultOptions: (_table) => ({
      enableExpanding: true,
      paginateExpandedRows: true,
    }),

    createTable: (table) => {
      table.setExpanded = (updater: Updater<ExpandedState>) => {
        table.setState((prev) => ({
          ...prev,
          expanded: functionalUpdate(updater, prev.expanded),
        }));
        table.options.onExpandedChange?.(updater);
      };

      table.resetExpanded = (defaultState?: boolean) => {
        table.setExpanded?.(
          defaultState ? {} : (table.initialState.expanded ?? {})
        );
      };

      table.toggleAllRowsExpanded = (value?: boolean) => {
        const expandAll = value ?? !table.getIsAllRowsExpanded?.();

        if (expandAll) {
          // Expand all - set to true for "all expanded"
          table.setExpanded?.(true);
        } else {
          // Collapse all
          table.setExpanded?.({});
        }
      };

      table.getIsAllRowsExpanded = () => {
        const { expanded } = table.getState();

        // If expanded === true, all rows are expanded
        if (expanded === true) return true;

        // Check if all expandable rows are expanded
        const rows = table.getRowModel().flatRows;
        return rows.every((row) => {
          if (!row.getCanExpand?.()) return true;
          return expanded[row.id];
        });
      };

      table.getIsSomeRowsExpanded = () => {
        const { expanded } = table.getState();

        if (expanded === true) return true;
        return Object.keys(expanded).some((id) => expanded[id]);
      };

      table.getCanSomeRowsExpand = () => {
        const rows = table.getRowModel().flatRows;
        return rows.some((row) => row.getCanExpand?.());
      };

      table.getToggleAllRowsExpandedHandler = () => {
        return () => table.toggleAllRowsExpanded?.();
      };

      table.getExpandedDepth = () => {
        const { expanded } = table.getState();

        if (expanded === true) {
          // Find max depth in data
          let maxDepth = 0;
          const rows = table.getCoreRowModel().flatRows;
          for (const row of rows) {
            maxDepth = Math.max(maxDepth, row.depth);
          }
          return maxDepth;
        }

        // Find max depth of expanded rows
        let maxDepth = 0;
        const rows = table.getCoreRowModel().flatRows;
        for (const row of rows) {
          if (expanded[row.id]) {
            maxDepth = Math.max(maxDepth, row.depth);
          }
        }
        return maxDepth;
      };
    },

    createRow: (row, table) => {
      row.getCanExpand = () => {
        const { enableExpanding, getRowCanExpand } = table.options;

        if (enableExpanding === false) return false;

        // Check custom function
        if (getRowCanExpand) {
          return getRowCanExpand(row);
        }

        // Default: can expand if has sub-rows
        return row.subRows.length > 0;
      };

      row.getIsExpanded = () => {
        const { expanded } = table.getState();

        // If expanded === true, all rows are expanded
        if (expanded === true) return true;

        return !!expanded[row.id];
      };

      row.getIsAllParentsExpanded = () => {
        const parentRows = row.getParentRows?.() ?? [];

        return parentRows.every((parentRow) => parentRow.getIsExpanded?.());
      };

      row.toggleExpanded = (value?: boolean) => {
        if (!row.getCanExpand?.()) return;

        const isExpanded = value ?? !row.getIsExpanded?.();

        table.setExpanded?.((prev) => {
          // Handle "all expanded" state
          if (prev === true) {
            if (!isExpanded) {
              // Collapse this row - need to build full expanded map minus this row
              const expanded: Record<string, boolean> = {};
              const rows = table.getCoreRowModel().flatRows;
              for (const r of rows) {
                if (r.getCanExpand?.() && r.id !== row.id) {
                  expanded[r.id] = true;
                }
              }
              return expanded;
            }
            return prev;
          }

          // Normal case
          if (isExpanded) {
            return { ...prev, [row.id]: true };
          } else {
            const { [row.id]: _, ...rest } = prev;
            return rest;
          }
        });
      };

      row.getToggleExpandedHandler = () => {
        return () => row.toggleExpanded?.();
      };
    },
  };
}
