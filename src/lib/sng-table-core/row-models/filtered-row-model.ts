/**
 * @fileoverview Filtered row model for sng-table-core
 *
 * Applies column filters and global filter to rows.
 * Supports filtering from leaf rows for hierarchical data.
 */

import { Row, RowModel, Table, RowModelFn, FilterMeta } from '../core/types';
import { memo } from '../core/utils';
import { getGlobalFilterFn, getGlobalFilterableColumns } from '../features/global-filtering';

// ============================================================================
// FILTERED ROW MODEL FACTORY
// ============================================================================

/**
 * Factory function to create the filtered row model
 *
 * @example
 * ```typescript
 * const table = createTable(() => ({
 *   data: myData,
 *   columns: myColumns,
 *   getCoreRowModel: getCoreRowModel(),
 *   getFilteredRowModel: getFilteredRowModel(),
 *   enableFilters: true,
 * }));
 * ```
 */
export function getFilteredRowModel<TData>(): RowModelFn<TData> {
  return (table: Table<TData>) => {
    return memo(
      // Dependencies - recompute when these change
      () => [
        table.getState().columnFilters,
        table.getState().globalFilter,
        table.getCoreRowModel(),
      ],

      // Compute function
      () => {
        const { columnFilters, globalFilter } = table.getState();
        const coreRowModel = table.getCoreRowModel();

        // If no filters, return core model
        if (!columnFilters.length && !globalFilter) {
          return coreRowModel;
        }

        return buildFilteredRowModel(
          table,
          coreRowModel,
          columnFilters,
          globalFilter
        );
      },

      // Options
      {
        debug: table.options.debugRows,
        debugLabel: 'getFilteredRowModel',
      }
    );
  };
}

// ============================================================================
// FILTERED ROW MODEL BUILDER
// ============================================================================

/**
 * Build the filtered row model
 */
function buildFilteredRowModel<TData>(
  table: Table<TData>,
  rowModel: RowModel<TData>,
  columnFilters: { id: string; value: unknown }[],
  globalFilter: string
): RowModel<TData> {
  const {
    filterFromLeafRows = false,
    maxLeafRowFilterDepth = 100,
  } = table.options;

  // Filter rows
  const filteredRows = filterRows(
    table,
    rowModel.rows,
    columnFilters,
    globalFilter,
    filterFromLeafRows,
    maxLeafRowFilterDepth
  );

  // Flatten filtered rows
  const flatRows = flattenRows(filteredRows);

  // Build rows by ID lookup
  const rowsById: Record<string, Row<TData>> = {};
  for (const row of flatRows) {
    rowsById[row.id] = row;
  }

  return {
    rows: filteredRows,
    flatRows,
    rowsById,
  };
}

/**
 * Filter rows with column filters and global filter
 */
function filterRows<TData>(
  table: Table<TData>,
  rows: Row<TData>[],
  columnFilters: { id: string; value: unknown }[],
  globalFilter: string,
  filterFromLeafRows: boolean,
  maxDepth: number,
  currentDepth = 0
): Row<TData>[] {
  if (filterFromLeafRows) {
    return filterRowsFromLeaves(
      table,
      rows,
      columnFilters,
      globalFilter,
      maxDepth,
      currentDepth
    );
  }

  return filterRowsFromRoot(
    table,
    rows,
    columnFilters,
    globalFilter,
    maxDepth,
    currentDepth
  );
}

/**
 * Filter rows starting from root (parent-first)
 * If parent matches, all children are included
 */
function filterRowsFromRoot<TData>(
  table: Table<TData>,
  rows: Row<TData>[],
  columnFilters: { id: string; value: unknown }[],
  globalFilter: string,
  maxDepth: number,
  currentDepth: number
): Row<TData>[] {
  const result: Row<TData>[] = [];

  for (const row of rows) {
    const passes = rowPassesFilters(table, row, columnFilters, globalFilter);

    if (passes) {
      // Row matches - include it with all children
      result.push(row);
    } else if (currentDepth < maxDepth && row.subRows.length) {
      // Row doesn't match, but check children
      const filteredSubRows = filterRowsFromRoot(
        table,
        row.subRows,
        columnFilters,
        globalFilter,
        maxDepth,
        currentDepth + 1
      );

      if (filteredSubRows.length) {
        // Some children match - include row with filtered children
        result.push({
          ...row,
          subRows: filteredSubRows,
        });
      }
    }
  }

  return result;
}

/**
 * Filter rows starting from leaves (child-first)
 * Parent is included if any child matches
 */
function filterRowsFromLeaves<TData>(
  table: Table<TData>,
  rows: Row<TData>[],
  columnFilters: { id: string; value: unknown }[],
  globalFilter: string,
  maxDepth: number,
  currentDepth: number
): Row<TData>[] {
  const result: Row<TData>[] = [];

  for (const row of rows) {
    let filteredSubRows: Row<TData>[] = [];

    // First, filter children
    if (currentDepth < maxDepth && row.subRows.length) {
      filteredSubRows = filterRowsFromLeaves(
        table,
        row.subRows,
        columnFilters,
        globalFilter,
        maxDepth,
        currentDepth + 1
      );
    }

    // Check if this row passes or has passing children
    const passes = rowPassesFilters(table, row, columnFilters, globalFilter);

    if (passes || filteredSubRows.length) {
      result.push({
        ...row,
        subRows: filteredSubRows,
      });
    }
  }

  return result;
}

/**
 * Check if a row passes all filters
 */
function rowPassesFilters<TData>(
  table: Table<TData>,
  row: Row<TData>,
  columnFilters: { id: string; value: unknown }[],
  globalFilter: string
): boolean {
  // Check column filters
  for (const filter of columnFilters) {
    const column = table.getColumn(filter.id);
    if (!column) continue;

    const filterFn = column.getFilterFn?.();
    if (!filterFn) continue;

    // Create meta collector
    let filterMeta: FilterMeta = {};
    const addMeta = (meta: FilterMeta) => {
      filterMeta = { ...filterMeta, ...meta };
    };

    const passes = filterFn(row, filter.id, filter.value, addMeta);

    // Store filter meta on row for potential use
    (row as unknown as { filterMeta?: FilterMeta }).filterMeta = filterMeta;

    if (!passes) {
      return false;
    }
  }

  // Check global filter
  if (globalFilter) {
    const globalFilterFn = getGlobalFilterFn(table);
    if (globalFilterFn) {
      const filterableColumns = getGlobalFilterableColumns(table);

      // Row passes if any filterable column matches
      const passesGlobal = filterableColumns.some((column) => {
        let filterMeta: FilterMeta = {};
        const addMeta = (meta: FilterMeta) => {
          filterMeta = { ...filterMeta, ...meta };
        };

        return globalFilterFn(row, column.id, globalFilter, addMeta);
      });

      if (!passesGlobal) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Flatten rows including sub-rows
 */
function flattenRows<TData>(rows: Row<TData>[]): Row<TData>[] {
  const result: Row<TData>[] = [];

  function addRow(row: Row<TData>) {
    result.push(row);
    for (const subRow of row.subRows) {
      addRow(subRow);
    }
  }

  for (const row of rows) {
    addRow(row);
  }

  return result;
}
