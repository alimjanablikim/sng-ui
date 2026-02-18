/**
 * @fileoverview Row grouping feature for sng-table-core
 *
 * Provides row grouping functionality with aggregation support.
 */

import {
  Row,
  GroupingState,
  Updater,
  functionalUpdate,
  TableFeature,
  AggregationFn,
  BuiltInAggregationFn,
} from '../core/types';

// ============================================================================
// BUILT-IN AGGREGATION FUNCTIONS
// ============================================================================

/**
 * Built-in aggregation functions
 */
export const aggregationFns: Record<BuiltInAggregationFn, AggregationFn<unknown>> = {
  sum: <TData>(columnId: string, leafRows: Row<TData>[]) => {
    return leafRows.reduce((sum, row) => {
      const value = row.getValue<number>(columnId);
      return sum + (typeof value === 'number' ? value : 0);
    }, 0);
  },

  min: <TData>(columnId: string, leafRows: Row<TData>[]) => {
    let min: number | undefined;
    for (const row of leafRows) {
      const value = row.getValue<number>(columnId);
      if (typeof value === 'number' && (min === undefined || value < min)) {
        min = value;
      }
    }
    return min;
  },

  max: <TData>(columnId: string, leafRows: Row<TData>[]) => {
    let max: number | undefined;
    for (const row of leafRows) {
      const value = row.getValue<number>(columnId);
      if (typeof value === 'number' && (max === undefined || value > max)) {
        max = value;
      }
    }
    return max;
  },

  extent: <TData>(columnId: string, leafRows: Row<TData>[]) => {
    let min: number | undefined;
    let max: number | undefined;
    for (const row of leafRows) {
      const value = row.getValue<number>(columnId);
      if (typeof value === 'number') {
        if (min === undefined || value < min) min = value;
        if (max === undefined || value > max) max = value;
      }
    }
    return [min, max] as [number | undefined, number | undefined];
  },

  mean: <TData>(columnId: string, leafRows: Row<TData>[]) => {
    let sum = 0;
    let count = 0;
    for (const row of leafRows) {
      const value = row.getValue<number>(columnId);
      if (typeof value === 'number') {
        sum += value;
        count++;
      }
    }
    return count > 0 ? sum / count : undefined;
  },

  median: <TData>(columnId: string, leafRows: Row<TData>[]) => {
    const values = leafRows
      .map((row) => row.getValue<number>(columnId))
      .filter((v): v is number => typeof v === 'number')
      .sort((a, b) => a - b);

    if (values.length === 0) return undefined;

    const mid = Math.floor(values.length / 2);
    return values.length % 2
      ? values[mid]
      : (values[mid - 1] + values[mid]) / 2;
  },

  unique: <TData>(columnId: string, leafRows: Row<TData>[]) => {
    const unique = new Set<unknown>();
    for (const row of leafRows) {
      unique.add(row.getValue(columnId));
    }
    return Array.from(unique);
  },

  uniqueCount: <TData>(columnId: string, leafRows: Row<TData>[]) => {
    const unique = new Set<unknown>();
    for (const row of leafRows) {
      unique.add(row.getValue(columnId));
    }
    return unique.size;
  },

  count: <TData>(_columnId: string, leafRows: Row<TData>[]) => {
    return leafRows.length;
  },
};

// ============================================================================
// ROW GROUPING FEATURE
// ============================================================================

/**
 * Create the row grouping feature
 */
export function createRowGroupingFeature<TData>(): TableFeature<TData> {
  return {
    getInitialState: (initialState) => ({
      grouping: initialState?.grouping ?? [],
    }),

    getDefaultOptions: (_table) => ({
      enableGrouping: true,
      groupedColumnMode: 'reorder' as const,
    }),

    createTable: (table) => {
      table.setGrouping = (updater: Updater<GroupingState>) => {
        table.setState((prev) => ({
          ...prev,
          grouping: functionalUpdate(updater, prev.grouping),
        }));
        table.options.onGroupingChange?.(updater);
      };

      table.resetGrouping = (defaultState?: boolean) => {
        table.setGrouping?.(
          defaultState ? [] : (table.initialState.grouping ?? [])
        );
      };
    },

    createColumn: (column, table) => {
      column.getCanGroup = () => {
        const { enableGrouping } = table.options;
        const { enableGrouping: columnEnableGrouping } = column.columnDef;

        if (columnEnableGrouping === false) return false;
        if (enableGrouping === false) return false;

        // Need accessor to group
        const accessorFn = column.getAccessorFn();
        return !!accessorFn;
      };

      column.getIsGrouped = () => {
        const { grouping } = table.getState();
        return grouping.includes(column.id);
      };

      column.getGroupedIndex = () => {
        const { grouping } = table.getState();
        return grouping.indexOf(column.id);
      };

      column.toggleGrouping = () => {
        if (!column.getCanGroup?.()) return;

        table.setGrouping?.((prev) => {
          if (prev.includes(column.id)) {
            return prev.filter((id) => id !== column.id);
          }
          return [...prev, column.id];
        });
      };

      column.getToggleGroupingHandler = () => {
        return () => column.toggleGrouping?.();
      };

      column.getAutoAggregationFn = () => {
        // Default to count for auto
        return aggregationFns.count as AggregationFn<TData>;
      };

      column.getAggregationFn = () => {
        const { aggregationFn } = column.columnDef;

        if (!aggregationFn || aggregationFn === 'auto') {
          return column.getAutoAggregationFn?.();
        }

        if (typeof aggregationFn === 'string') {
          const builtIn = aggregationFns[aggregationFn as BuiltInAggregationFn];
          if (builtIn) {
            return builtIn as AggregationFn<TData>;
          }
          console.warn(`[sng-table] Unknown aggregation function: ${aggregationFn}`);
          return aggregationFns.count as AggregationFn<TData>;
        }

        return aggregationFn as AggregationFn<TData>;
      };
    },

    createRow: (row, table) => {
      // These are set during grouping row model creation
      row.getIsGrouped = () => !!row.groupingColumnId;

      row.getGroupingValue = (columnId: string) => {
        const column = table.getColumn(columnId);
        if (!column) return undefined;

        const { getGroupingValue } = column.columnDef;
        if (getGroupingValue) {
          return getGroupingValue(row.original);
        }

        return row.getValue(columnId);
      };
    },
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export { aggregationFns as builtInAggregationFns };
