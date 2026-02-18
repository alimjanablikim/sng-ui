/**
 * @fileoverview Sorting feature for sng-table-core
 *
 * Provides column sorting functionality with support for:
 * - Single and multi-column sorting
 * - Custom sorting functions
 * - Ascending/descending toggle
 * - Sort removal
 */

import {
  Table,
  Column,
  Row,
  SortingState,
  ColumnSort,
  SortDirection,
  SortingFn,
  BuiltInSortingFn,
  Updater,
  functionalUpdate,
  TableFeature,
} from '../core/types';

// ============================================================================
// BUILT-IN SORTING FUNCTIONS
// ============================================================================

/**
 * Built-in sorting functions
 */
export const sortingFns: Record<BuiltInSortingFn, SortingFn<unknown>> = {
  /**
   * Alphanumeric sort - handles numbers within strings naturally
   * "item2" comes before "item10"
   */
  alphanumeric: <TData>(rowA: Row<TData>, rowB: Row<TData>, columnId: string): number => {
    const a = rowA.getValue<unknown>(columnId);
    const b = rowB.getValue<unknown>(columnId);
    return compareAlphanumeric(toString(a), toString(b));
  },

  /**
   * Case-sensitive alphanumeric sort
   */
  alphanumericCaseSensitive: <TData>(rowA: Row<TData>, rowB: Row<TData>, columnId: string): number => {
    const a = rowA.getValue<unknown>(columnId);
    const b = rowB.getValue<unknown>(columnId);
    return compareAlphanumericCaseSensitive(toString(a), toString(b));
  },

  /**
   * Text sort - simple string comparison (case-insensitive)
   */
  text: <TData>(rowA: Row<TData>, rowB: Row<TData>, columnId: string): number => {
    const a = rowA.getValue<unknown>(columnId);
    const b = rowB.getValue<unknown>(columnId);
    return compareText(toString(a), toString(b));
  },

  /**
   * Case-sensitive text sort
   */
  textCaseSensitive: <TData>(rowA: Row<TData>, rowB: Row<TData>, columnId: string): number => {
    const a = rowA.getValue<unknown>(columnId);
    const b = rowB.getValue<unknown>(columnId);
    return compareTextCaseSensitive(toString(a), toString(b));
  },

  /**
   * Datetime sort - compares Date objects or date strings
   */
  datetime: <TData>(rowA: Row<TData>, rowB: Row<TData>, columnId: string): number => {
    const a = rowA.getValue<unknown>(columnId);
    const b = rowB.getValue<unknown>(columnId);
    return compareDatetime(a, b);
  },

  /**
   * Basic sort - simple comparison using < and >
   */
  basic: <TData>(rowA: Row<TData>, rowB: Row<TData>, columnId: string): number => {
    const a = rowA.getValue<unknown>(columnId);
    const b = rowB.getValue<unknown>(columnId);
    return compareBasic(a, b);
  },
};

// ============================================================================
// COMPARISON HELPERS
// ============================================================================

function toString(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return String(value);
}

function compareAlphanumeric(a: string, b: string): number {
  return a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

function compareAlphanumericCaseSensitive(a: string, b: string): number {
  return a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: 'case',
  });
}

function compareText(a: string, b: string): number {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

function compareTextCaseSensitive(a: string, b: string): number {
  return a.localeCompare(b);
}

function compareDatetime(a: unknown, b: unknown): number {
  const dateA = a instanceof Date ? a : new Date(a as string | number);
  const dateB = b instanceof Date ? b : new Date(b as string | number);

  // Handle invalid dates
  const timeA = dateA.getTime();
  const timeB = dateB.getTime();

  if (isNaN(timeA) && isNaN(timeB)) return 0;
  if (isNaN(timeA)) return 1;
  if (isNaN(timeB)) return -1;

  return timeA - timeB;
}

function compareBasic(a: unknown, b: unknown): number {
  // Handle null/undefined - push to end
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;

  // Simple comparison
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

// ============================================================================
// SORTING FEATURE
// ============================================================================

/**
 * Create the sorting feature
 */
export function createSortingFeature<TData>(): TableFeature<TData> {
  return {
    getInitialState: (initialState) => ({
      sorting: initialState?.sorting ?? [],
    }),

    getDefaultOptions: (_table) => ({
      enableSorting: true,
      enableMultiSort: true,
      enableSortingRemoval: true,
      sortDescFirst: false,
      maxMultiSortColCount: Number.MAX_SAFE_INTEGER,
      isMultiSortEvent: (e: unknown) => {
        // Default: shift key for multi-sort
        return (e as { shiftKey?: boolean })?.shiftKey ?? false;
      },
    }),

    createTable: (table) => {
      // Add table-level sorting APIs
      table.setSorting = (updater: Updater<SortingState>) => {
        table.setState((prev) => ({
          ...prev,
          sorting: functionalUpdate(updater, prev.sorting),
        }));
        table.options.onSortingChange?.(updater);
      };

      table.resetSorting = (defaultState?: boolean) => {
        table.setSorting?.(
          defaultState ? [] : (table.initialState.sorting ?? [])
        );
      };
    },

    createColumn: (column, table) => {
      // Add column-level sorting APIs
      column.getCanSort = () => getColumnCanSort(column, table);
      column.getIsSorted = () => getColumnIsSorted(column, table);
      column.getSortIndex = () => getColumnSortIndex(column, table);
      column.getNextSortingOrder = () => getNextSortingOrder(column, table);
      column.getAutoSortingFn = () => getAutoSortingFn(column);
      column.getSortingFn = () => getSortingFn(column, table);

      column.toggleSorting = (desc?: boolean, isMulti?: boolean) => {
        toggleColumnSorting(column, table, desc, isMulti);
      };

      column.clearSorting = () => {
        clearColumnSorting(column, table);
      };
    },
  };
}

// ============================================================================
// COLUMN SORTING HELPERS
// ============================================================================

/**
 * Check if column can be sorted
 */
function getColumnCanSort<TData>(
  column: Column<TData, unknown>,
  table: Table<TData>
): boolean {
  // Check column-level setting
  if (column.columnDef.enableSorting === false) {
    return false;
  }

  // Check table-level setting
  if (table.options.enableSorting === false) {
    return false;
  }

  // Check if column has accessor (can't sort display columns)
  const accessorFn = column.getAccessorFn();
  if (!accessorFn) {
    return false;
  }

  return true;
}

/**
 * Get current sort direction for column
 */
function getColumnIsSorted<TData>(
  column: Column<TData, unknown>,
  table: Table<TData>
): false | SortDirection {
  const { sorting } = table.getState();
  const sortEntry = sorting.find((s) => s.id === column.id);

  if (!sortEntry) {
    return false;
  }

  return sortEntry.desc ? 'desc' : 'asc';
}

/**
 * Get sort index for multi-sort (0-based)
 */
function getColumnSortIndex<TData>(
  column: Column<TData, unknown>,
  table: Table<TData>
): number {
  const { sorting } = table.getState();
  return sorting.findIndex((s) => s.id === column.id);
}

/**
 * Get next sorting order when toggling
 */
function getNextSortingOrder<TData>(
  column: Column<TData, unknown>,
  table: Table<TData>
): SortDirection | false {
  const currentSort = column.getIsSorted?.();
  const { enableSortingRemoval, sortDescFirst } = table.options;
  const firstSort = column.columnDef.sortDescFirst ?? sortDescFirst;

  // Determine the cycle
  // If sortDescFirst: desc -> asc -> (none)
  // Otherwise: asc -> desc -> (none)

  if (currentSort === false) {
    // Not sorted - go to first sort
    return firstSort ? 'desc' : 'asc';
  }

  if (currentSort === 'asc') {
    // Ascending - either go to desc or remove
    if (firstSort) {
      // In desc-first mode, asc is last before removal
      return enableSortingRemoval ? false : 'desc';
    } else {
      // In asc-first mode, go to desc
      return 'desc';
    }
  }

  // Descending
  if (firstSort) {
    // In desc-first mode, go to asc
    return 'asc';
  } else {
    // In asc-first mode, desc is last before removal
    return enableSortingRemoval ? false : 'asc';
  }
}

/**
 * Get auto-detected sorting function based on data type
 */
function getAutoSortingFn<TData>(
  _column: Column<TData, unknown>
): SortingFn<TData> {
  // For now, default to alphanumeric
  // In a more complete implementation, we'd sample the data to detect type
  return sortingFns.alphanumeric as SortingFn<TData>;
}

/**
 * Get the sorting function for a column
 */
function getSortingFn<TData>(
  column: Column<TData, unknown>,
  _table: Table<TData>
): SortingFn<TData> {
  const { sortingFn } = column.columnDef;

  // No sorting function specified - use auto
  if (!sortingFn || sortingFn === 'auto') {
    return column.getAutoSortingFn?.() ?? (sortingFns.alphanumeric as SortingFn<TData>);
  }

  // Built-in sorting function
  if (typeof sortingFn === 'string') {
    const builtIn = sortingFns[sortingFn as BuiltInSortingFn];
    if (builtIn) {
      return builtIn as SortingFn<TData>;
    }
    console.warn(`[sng-table] Unknown sorting function: ${sortingFn}`);
    return sortingFns.alphanumeric as SortingFn<TData>;
  }

  // Custom sorting function
  return sortingFn as SortingFn<TData>;
}

/**
 * Toggle sorting for a column
 */
function toggleColumnSorting<TData>(
  column: Column<TData, unknown>,
  table: Table<TData>,
  desc?: boolean,
  isMulti?: boolean
): void {
  if (!column.getCanSort?.()) {
    return;
  }

  const { sorting } = table.getState();
  const { enableMultiSort, maxMultiSortColCount } = table.options;

  // Determine if this is a multi-sort operation
  const multi = isMulti ?? false;

  // Get the next sort direction
  let nextSort: SortDirection | false;

  if (desc !== undefined) {
    // Explicit direction provided
    nextSort = desc ? 'desc' : 'asc';
  } else {
    // Toggle to next in cycle
    nextSort = column.getNextSortingOrder?.() ?? false;
  }

  // Build new sorting state
  let newSorting: SortingState;

  if (nextSort === false) {
    // Remove this column from sorting
    newSorting = sorting.filter((s) => s.id !== column.id);
  } else if (multi && enableMultiSort) {
    // Multi-sort: add or update this column
    const existingIndex = sorting.findIndex((s) => s.id === column.id);

    if (existingIndex >= 0) {
      // Update existing
      newSorting = sorting.map((s, i) =>
        i === existingIndex ? { id: column.id, desc: nextSort === 'desc' } : s
      );
    } else {
      // Add new
      const newEntry: ColumnSort = { id: column.id, desc: nextSort === 'desc' };

      if (sorting.length >= (maxMultiSortColCount ?? Number.MAX_SAFE_INTEGER)) {
        // Replace oldest sort
        newSorting = [...sorting.slice(1), newEntry];
      } else {
        newSorting = [...sorting, newEntry];
      }
    }
  } else {
    // Single sort: replace all
    newSorting = [{ id: column.id, desc: nextSort === 'desc' }];
  }

  table.setSorting?.(newSorting);
}

/**
 * Clear sorting for a column
 */
function clearColumnSorting<TData>(
  column: Column<TData, unknown>,
  table: Table<TData>
): void {
  table.setSorting?.((prev) => prev.filter((s) => s.id !== column.id));
}

// ============================================================================
// EXPORTS
// ============================================================================

export { sortingFns as builtInSortingFns };
