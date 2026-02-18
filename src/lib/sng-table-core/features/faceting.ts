/**
 * @fileoverview Faceting feature for sng-table-core
 *
 * Provides faceted values (unique values, counts, min/max) for filter UI.
 */

import {
  Table,
  Column,
  Row,
  TableFeature,
} from '../core/types';
import { memo } from '../core/utils';

// ============================================================================
// FACETING FEATURE
// ============================================================================

/**
 * Create the faceting feature
 *
 * Faceting provides methods to get unique values and their counts,
 * as well as min/max values for numeric columns. This is useful for
 * building filter UI components like dropdown filters, checkbox filters,
 * and range sliders.
 */
export function createFacetingFeature<TData>(): TableFeature<TData> {
  return {
    getDefaultOptions: () => ({}),

    createColumn: (column, table) => {
      /**
       * Get the faceted row model for this column
       * Returns rows filtered by all columns EXCEPT this one
       */
      column.getFacetedRowModel = () => {
        return getFacetedRowModelForColumn(table, column);
      };

      /**
       * Get unique values and their counts for this column
       * Returns a Map of value -> count
       */
      column.getFacetedUniqueValues = () => {
        return getFacetedUniqueValuesForColumn(table, column);
      };

      /**
       * Get min and max values for this column (numeric columns)
       * Returns [min, max] tuple
       */
      column.getFacetedMinMaxValues = () => {
        return getFacetedMinMaxValuesForColumn(table, column);
      };
    },
  };
}

// ============================================================================
// FACETED ROW MODEL (per column)
// ============================================================================

/**
 * Get the faceted row model for a specific column
 *
 * This returns rows filtered by all columns EXCEPT the specified column.
 * This is useful for showing filter options that remain valid given
 * the current filters on OTHER columns.
 */
function getFacetedRowModelForColumn<TData>(
  table: Table<TData>,
  column: Column<TData>
): () => Row<TData>[] {
  return memo(
    // Dependencies
    () => [
      table.getState().columnFilters,
      table.getPreFilteredRowModel?.(),
    ],

    // Compute function
    () => {
      const { columnFilters } = table.getState();
      const preFilteredRowModel = table.getPreFilteredRowModel?.() ?? table.getCoreRowModel();

      // Filter by all columns except this one
      const otherFilters = columnFilters.filter((f) => f.id !== column.id);

      if (!otherFilters.length) {
        return preFilteredRowModel.flatRows;
      }

      // Apply other filters
      return preFilteredRowModel.flatRows.filter((row) => {
        for (const filter of otherFilters) {
          const filterColumn = table.getColumn(filter.id);
          if (!filterColumn) continue;

          const filterFn = filterColumn.getFilterFn?.();
          if (!filterFn) continue;

          const filterValue = filter.value;
          if (filterValue === undefined || filterValue === null) continue;

          const passes = filterFn(row, filter.id, filterValue, () => { /* addMeta callback - not used in faceting */ });
          if (!passes) return false;
        }
        return true;
      });
    },

    // Options
    {
      debug: table.options.debugColumns,
      debugLabel: `getFacetedRowModel_${column.id}`,
    }
  );
}

// ============================================================================
// FACETED UNIQUE VALUES
// ============================================================================

/**
 * Get unique values and their counts for a column
 *
 * Uses the faceted row model (rows filtered by other columns)
 * to calculate what values are available and how many rows have each value.
 */
function getFacetedUniqueValuesForColumn<TData>(
  table: Table<TData>,
  column: Column<TData>
): () => Map<unknown, number> {
  return memo(
    // Dependencies
    () => [column.getFacetedRowModel?.()?.()],

    // Compute function
    () => {
      const facetedRows = column.getFacetedRowModel?.()?.() ?? [];
      const uniqueValues = new Map<unknown, number>();

      for (const row of facetedRows) {
        const value = row.getValue(column.id);

        // Handle array values (multi-select)
        if (Array.isArray(value)) {
          for (const v of value) {
            const count = uniqueValues.get(v) ?? 0;
            uniqueValues.set(v, count + 1);
          }
        } else {
          const count = uniqueValues.get(value) ?? 0;
          uniqueValues.set(value, count + 1);
        }
      }

      return uniqueValues;
    },

    // Options
    {
      debug: table.options.debugColumns,
      debugLabel: `getFacetedUniqueValues_${column.id}`,
    }
  );
}

// ============================================================================
// FACETED MIN/MAX VALUES
// ============================================================================

/**
 * Get min and max values for a numeric column
 *
 * Uses the faceted row model to calculate the range of values
 * available given the current filters on other columns.
 */
function getFacetedMinMaxValuesForColumn<TData>(
  table: Table<TData>,
  column: Column<TData>
): () => [number, number] | undefined {
  return memo(
    // Dependencies
    () => [column.getFacetedRowModel?.()?.()],

    // Compute function
    () => {
      const facetedRows = column.getFacetedRowModel?.()?.() ?? [];

      if (facetedRows.length === 0) {
        return undefined;
      }

      let min: number | undefined;
      let max: number | undefined;

      for (const row of facetedRows) {
        const value = row.getValue<unknown>(column.id);

        // Handle numeric values
        if (typeof value === 'number' && !isNaN(value)) {
          if (min === undefined || value < min) min = value;
          if (max === undefined || value > max) max = value;
        }

        // Handle array of numbers (multi-value)
        if (Array.isArray(value)) {
          for (const v of value) {
            if (typeof v === 'number' && !isNaN(v)) {
              if (min === undefined || v < min) min = v;
              if (max === undefined || v > max) max = v;
            }
          }
        }
      }

      if (min === undefined || max === undefined) {
        return undefined;
      }

      return [min, max];
    },

    // Options
    {
      debug: table.options.debugColumns,
      debugLabel: `getFacetedMinMaxValues_${column.id}`,
    }
  );
}

// ============================================================================
// GLOBAL FACETING HELPERS
// ============================================================================

/**
 * Get all unique values across all filterable columns
 *
 * Useful for global search autocomplete suggestions.
 */
export function getGlobalFacetedUniqueValues<TData>(
  table: Table<TData>
): Map<string, Map<unknown, number>> {
  const result = new Map<string, Map<unknown, number>>();

  for (const column of table.getAllLeafColumns()) {
    if (column.getCanFilter?.() || column.getCanGlobalFilter?.()) {
      const uniqueValues = column.getFacetedUniqueValues?.()?.();
      if (uniqueValues) {
        result.set(column.id, uniqueValues);
      }
    }
  }

  return result;
}

/**
 * Get min/max values for all numeric filterable columns
 *
 * Useful for building range filters UI.
 */
export function getGlobalFacetedMinMaxValues<TData>(
  table: Table<TData>
): Map<string, [number, number]> {
  const result = new Map<string, [number, number]>();

  for (const column of table.getAllLeafColumns()) {
    if (column.getCanFilter?.() || column.getCanGlobalFilter?.()) {
      const minMax = column.getFacetedMinMaxValues?.()?.();
      if (minMax) {
        result.set(column.id, minMax);
      }
    }
  }

  return result;
}
