/**
 * @fileoverview Global filtering feature for sng-table-core
 *
 * Provides table-wide search/filter functionality that searches
 * across all filterable columns.
 */

import {
  Table,
  Column,
  Updater,
  functionalUpdate,
  TableFeature,
  FilterFn,
} from '../core/types';
import { filterFns } from './column-filtering';

// ============================================================================
// GLOBAL FILTERING FEATURE
// ============================================================================

/**
 * Create the global filtering feature
 */
export function createGlobalFilteringFeature<TData>(): TableFeature<TData> {
  return {
    getInitialState: (initialState) => ({
      globalFilter: initialState?.globalFilter ?? '',
    }),

    getDefaultOptions: (_table) => ({
      enableGlobalFilter: true,
      globalFilterFn: 'includesString',
      getColumnCanGlobalFilter: (column: Column<TData, unknown>) => {
        // By default, only columns with accessors can be globally filtered
        const accessorFn = column.getAccessorFn();
        if (!accessorFn) {
          return false;
        }

        // Check column-level setting
        if (column.columnDef.enableGlobalFilter === false) {
          return false;
        }

        return true;
      },
    }),

    createTable: (table) => {
      // Add table-level global filter APIs
      table.setGlobalFilter = (updater: Updater<string>) => {
        table.setState((prev) => ({
          ...prev,
          globalFilter: functionalUpdate(updater, prev.globalFilter),
        }));
        table.options.onGlobalFilterChange?.(updater);
      };

      table.resetGlobalFilter = (defaultState?: boolean) => {
        table.setGlobalFilter?.(
          defaultState ? '' : (table.initialState.globalFilter ?? '')
        );
      };
    },

    createColumn: (_column, _table) => {
      // Columns don't have specific global filter APIs
      // Global filtering is controlled at table level
      // But columns can opt-out via enableGlobalFilter
    },
  };
}

// ============================================================================
// GLOBAL FILTER HELPERS
// ============================================================================

/**
 * Get global filter function
 */
export function getGlobalFilterFn<TData>(
  table: Table<TData>
): FilterFn<TData> | undefined {
  const { globalFilterFn } = table.options;

  if (!globalFilterFn) {
    return filterFns.includesString as FilterFn<TData>;
  }

  // Built-in filter function
  if (typeof globalFilterFn === 'string') {
    const builtIn = filterFns[globalFilterFn as keyof typeof filterFns];
    if (builtIn) {
      return builtIn as FilterFn<TData>;
    }
    console.warn(`[sng-table] Unknown global filter function: ${globalFilterFn}`);
    return filterFns.includesString as FilterFn<TData>;
  }

  // Custom filter function
  return globalFilterFn as FilterFn<TData>;
}

/**
 * Get columns that can be globally filtered
 */
export function getGlobalFilterableColumns<TData>(
  table: Table<TData>
): Column<TData, unknown>[] {
  const { getColumnCanGlobalFilter } = table.options;

  return table.getAllLeafColumns().filter((column) => {
    // Check table-level function
    if (getColumnCanGlobalFilter && !getColumnCanGlobalFilter(column)) {
      return false;
    }

    // Check column-level setting
    if (column.columnDef.enableGlobalFilter === false) {
      return false;
    }

    // Check if column has accessor
    const accessorFn = column.getAccessorFn();
    return !!accessorFn;
  });
}
