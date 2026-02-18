/**
 * @fileoverview Column filtering feature for sng-table-core
 *
 * Provides per-column filtering functionality with support for:
 * - Custom filter functions
 * - Built-in filter functions
 * - Filter from leaf rows (for hierarchical data)
 */

import {
  Table,
  Column,
  Row,
  ColumnFiltersState,
  ColumnFilter,
  FilterFn,
  BuiltInFilterFn,
  Updater,
  functionalUpdate,
  TableFeature,
} from '../core/types';

// ============================================================================
// BUILT-IN FILTER FUNCTIONS
// ============================================================================

/**
 * Built-in filter functions
 */
export const filterFns: Record<BuiltInFilterFn, FilterFn<unknown>> = {
  /**
   * Includes string (case-insensitive)
   */
  includesString: <TData>(
    row: Row<TData>,
    columnId: string,
    filterValue: unknown
  ): boolean => {
    const value = row.getValue<unknown>(columnId);
    const search = String(filterValue).toLowerCase();
    return String(value).toLowerCase().includes(search);
  },

  /**
   * Includes string (case-sensitive)
   */
  includesStringSensitive: <TData>(
    row: Row<TData>,
    columnId: string,
    filterValue: unknown
  ): boolean => {
    const value = row.getValue<unknown>(columnId);
    return String(value).includes(String(filterValue));
  },

  /**
   * Equals string (case-insensitive)
   */
  equalsString: <TData>(
    row: Row<TData>,
    columnId: string,
    filterValue: unknown
  ): boolean => {
    const value = row.getValue<unknown>(columnId);
    return String(value).toLowerCase() === String(filterValue).toLowerCase();
  },

  /**
   * Array includes value
   */
  arrIncludes: <TData>(
    row: Row<TData>,
    columnId: string,
    filterValue: unknown
  ): boolean => {
    const value = row.getValue<unknown[]>(columnId);
    return Array.isArray(value) && value.includes(filterValue);
  },

  /**
   * Array includes all values
   */
  arrIncludesAll: <TData>(
    row: Row<TData>,
    columnId: string,
    filterValue: unknown
  ): boolean => {
    const value = row.getValue<unknown[]>(columnId);
    const filters = filterValue as unknown[];
    return (
      Array.isArray(value) &&
      Array.isArray(filters) &&
      filters.every((f) => value.includes(f))
    );
  },

  /**
   * Array includes some values
   */
  arrIncludesSome: <TData>(
    row: Row<TData>,
    columnId: string,
    filterValue: unknown
  ): boolean => {
    const value = row.getValue<unknown[]>(columnId);
    const filters = filterValue as unknown[];
    return (
      Array.isArray(value) &&
      Array.isArray(filters) &&
      filters.some((f) => value.includes(f))
    );
  },

  /**
   * Strict equality
   */
  equals: <TData>(
    row: Row<TData>,
    columnId: string,
    filterValue: unknown
  ): boolean => {
    const value = row.getValue<unknown>(columnId);
    return value === filterValue;
  },

  /**
   * Weak equality (==)
   */
  weakEquals: <TData>(
    row: Row<TData>,
    columnId: string,
    filterValue: unknown
  ): boolean => {
    const value = row.getValue<unknown>(columnId);
    return value == filterValue;  
  },

  /**
   * Number in range [min, max]
   */
  inNumberRange: <TData>(
    row: Row<TData>,
    columnId: string,
    filterValue: unknown
  ): boolean => {
    const value = row.getValue<number>(columnId);
    const [min, max] = filterValue as [number, number];

    if (typeof value !== 'number') {
      return false;
    }

    const hasMin = min !== undefined && min !== null;
    const hasMax = max !== undefined && max !== null;

    if (hasMin && hasMax) {
      return value >= min && value <= max;
    }
    if (hasMin) {
      return value >= min;
    }
    if (hasMax) {
      return value <= max;
    }

    return true;
  },
};

// ============================================================================
// COLUMN FILTERING FEATURE
// ============================================================================

/**
 * Create the column filtering feature
 */
export function createColumnFilteringFeature<TData>(): TableFeature<TData> {
  return {
    getInitialState: (initialState) => ({
      columnFilters: initialState?.columnFilters ?? [],
    }),

    getDefaultOptions: (_table) => ({
      enableFilters: true,
      enableColumnFilters: true,
      filterFromLeafRows: false,
      maxLeafRowFilterDepth: 100,
    }),

    createTable: (table) => {
      // Add table-level filtering APIs
      table.setColumnFilters = (updater: Updater<ColumnFiltersState>) => {
        table.setState((prev) => ({
          ...prev,
          columnFilters: functionalUpdate(updater, prev.columnFilters),
        }));
        table.options.onColumnFiltersChange?.(updater);
      };

      table.resetColumnFilters = (defaultState?: boolean) => {
        table.setColumnFilters?.(
          defaultState ? [] : (table.initialState.columnFilters ?? [])
        );
      };
    },

    createColumn: (column, table) => {
      // Add column-level filtering APIs
      column.getCanFilter = () => getColumnCanFilter(column, table);
      column.getIsFiltered = () => getColumnIsFiltered(column, table);
      column.getFilterValue = () => getColumnFilterValue(column, table);
      column.getFilterIndex = () => getColumnFilterIndex(column, table);
      column.getAutoFilterFn = () => getAutoFilterFn(column);
      column.getFilterFn = () => getFilterFn(column, table);

      column.setFilterValue = (value: unknown) => {
        setColumnFilterValue(column, table, value);
      };
    },
  };
}

// ============================================================================
// COLUMN FILTERING HELPERS
// ============================================================================

/**
 * Check if column can be filtered
 */
function getColumnCanFilter<TData>(
  column: Column<TData, unknown>,
  table: Table<TData>
): boolean {
  // Check column-level setting
  if (column.columnDef.enableColumnFilter === false) {
    return false;
  }

  // Check table-level settings
  if (table.options.enableFilters === false) {
    return false;
  }
  if (table.options.enableColumnFilters === false) {
    return false;
  }

  // Check if column has accessor (can't filter display columns)
  const accessorFn = column.getAccessorFn();
  if (!accessorFn) {
    return false;
  }

  return true;
}

/**
 * Check if column has an active filter
 */
function getColumnIsFiltered<TData>(
  column: Column<TData, unknown>,
  table: Table<TData>
): boolean {
  const { columnFilters } = table.getState();
  return columnFilters.some((f) => f.id === column.id);
}

/**
 * Get current filter value for column
 */
function getColumnFilterValue<TData>(
  column: Column<TData, unknown>,
  table: Table<TData>
): unknown {
  const { columnFilters } = table.getState();
  const filter = columnFilters.find((f) => f.id === column.id);
  return filter?.value;
}

/**
 * Get filter index for column
 */
function getColumnFilterIndex<TData>(
  column: Column<TData, unknown>,
  table: Table<TData>
): number {
  const { columnFilters } = table.getState();
  return columnFilters.findIndex((f) => f.id === column.id);
}

/**
 * Get auto-detected filter function
 */
function getAutoFilterFn<TData>(
  _column: Column<TData, unknown>
): FilterFn<TData> | undefined {
  // Default to includesString for auto
  return filterFns.includesString as FilterFn<TData>;
}

/**
 * Get the filter function for a column
 */
function getFilterFn<TData>(
  column: Column<TData, unknown>,
  _table: Table<TData>
): FilterFn<TData> | undefined {
  const { filterFn } = column.columnDef;

  // No filter function specified - use auto
  if (!filterFn || filterFn === 'auto') {
    return column.getAutoFilterFn?.();
  }

  // Built-in filter function
  if (typeof filterFn === 'string') {
    const builtIn = filterFns[filterFn as BuiltInFilterFn];
    if (builtIn) {
      return builtIn as FilterFn<TData>;
    }
    console.warn(`[sng-table] Unknown filter function: ${filterFn}`);
    return filterFns.includesString as FilterFn<TData>;
  }

  // Custom filter function
  return filterFn as FilterFn<TData>;
}

/**
 * Set filter value for a column
 */
function setColumnFilterValue<TData>(
  column: Column<TData, unknown>,
  table: Table<TData>,
  value: unknown
): void {
  if (!column.getCanFilter?.()) {
    return;
  }

  table.setColumnFilters?.((prev) => {
    const existingIndex = prev.findIndex((f) => f.id === column.id);

    // Remove filter if value is undefined/null/empty
    const shouldRemove =
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value === '') ||
      (Array.isArray(value) && value.length === 0);

    if (shouldRemove) {
      if (existingIndex >= 0) {
        return [...prev.slice(0, existingIndex), ...prev.slice(existingIndex + 1)];
      }
      return prev;
    }

    // Add or update filter
    const newFilter: ColumnFilter = { id: column.id, value };

    if (existingIndex >= 0) {
      return [
        ...prev.slice(0, existingIndex),
        newFilter,
        ...prev.slice(existingIndex + 1),
      ];
    }

    return [...prev, newFilter];
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

export { filterFns as builtInFilterFns };
