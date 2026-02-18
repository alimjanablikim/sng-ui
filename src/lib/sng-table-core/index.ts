/**
 * @fileoverview Public API exports for sng-table-core
 *
 * This is the headless table core - pure logic with no UI.
 * Use this for full control over table functionality with Angular signals.
 *
 * @example
 * ```typescript
 * import { createTable, getCoreRowModel } from 'sng-ui';
 *
 * const table = createTable(() => ({
 *   data: myData(),
 *   columns: myColumns,
 *   getCoreRowModel: getCoreRowModel(),
 * }));
 * ```
 */

// ============================================================================
// CORE
// ============================================================================

// Table factory
export { createTable } from './core/create-table';

// ============================================================================
// ROW MODELS
// ============================================================================

export {
  getCoreRowModel,
  createEmptyRowModel,
  filterRows,
  sortRows,
  paginateRows,
  expandRows,
} from './row-models/core-row-model';

export { getSortedRowModel } from './row-models/sorted-row-model';

export { getFilteredRowModel } from './row-models/filtered-row-model';

export { getPaginatedRowModel } from './row-models/paginated-row-model';

export { getExpandedRowModel } from './row-models/expanded-row-model';

export { getGroupedRowModel } from './row-models/grouped-row-model';

// ============================================================================
// FEATURES
// ============================================================================

export {
  createSortingFeature,
  sortingFns,
  builtInSortingFns,
} from './features/sorting';

export {
  createColumnFilteringFeature,
  filterFns,
  builtInFilterFns,
} from './features/column-filtering';

export {
  createGlobalFilteringFeature,
  getGlobalFilterFn,
  getGlobalFilterableColumns,
} from './features/global-filtering';

export {
  fuzzyFilter,
  createFuzzyFilter,
  fuzzySort,
  rankString,
  rankItem,
  type RankingInfo,
} from './features/fuzzy-filtering';

export {
  createPaginationFeature,
  maybeAutoResetPageIndex,
} from './features/pagination';

export { createRowSelectionFeature } from './features/row-selection';

export { createColumnVisibilityFeature } from './features/column-visibility';

export { createColumnSizingFeature } from './features/column-sizing';

export {
  createColumnOrderingFeature,
  moveColumn,
  swapColumns,
} from './features/column-ordering';

export { createColumnPinningFeature } from './features/column-pinning';

export { createRowPinningFeature } from './features/row-pinning';

export { createRowExpandingFeature } from './features/row-expanding';

export {
  createRowGroupingFeature,
  aggregationFns,
  builtInAggregationFns,
} from './features/row-grouping';

export {
  createFacetingFeature,
  getGlobalFacetedUniqueValues,
  getGlobalFacetedMinMaxValues,
} from './features/faceting';

export {
  createVirtualizationFeature,
  calculateVirtualRange,
  calculateTotalHeight,
  calculateScrollOffset,
  createRowTrackByFn,
  createIndexTrackByFn,
  getRowsInRange,
  measureRows,
  findRowIndexAtPosition,
  createVirtualDataSource,
  getVirtualRowHeight,
  type VirtualRange,
  type VirtualRowMeasurement,
  type VirtualizationOptions,
} from './features/virtualization';

// ============================================================================
// TYPES
// ============================================================================

export type {
  // Utility types
  Updater,
  DeepKeys,
  DeepValue,

  // Accessor types
  AccessorFn,
  AccessorKey,

  // Render types
  ColumnDefTemplate,

  // Column types
  ColumnDef,
  DisplayColumnDef,
  GroupColumnDef,
  ColumnDefResolved,
  Column,

  // Row types
  Row,

  // Cell types
  Cell,
  CellContext,

  // Header types
  Header,
  HeaderGroup,
  HeaderContext,

  // Row model types
  RowModel,
  RowModelFn,

  // State types
  TableState,
  InitialTableState,
  SortingState,
  ColumnSort,
  SortDirection,
  ColumnFiltersState,
  ColumnFilter,
  PaginationState,
  RowSelectionState,
  ColumnVisibilityState,
  ColumnSizingState,
  ColumnSizingInfoState,
  ColumnOrderState,
  ColumnPinningPosition,
  ColumnPinningState,
  RowPinningPosition,
  RowPinningState,
  ExpandedState,
  GroupingState,

  // Sorting types
  SortingFn,
  BuiltInSortingFn,
  SortingFnOption,

  // Filter types
  FilterFn,
  BuiltInFilterFn,
  FilterFnOption,
  FilterMeta,

  // Aggregation types
  AggregationFn,
  BuiltInAggregationFn,
  AggregationFnOption,

  // Table types
  TableOptions,
  Table,

  // Feature types
  TableFeature,
} from './core/types';

// Export functionalUpdate utility
export { functionalUpdate } from './core/types';

// ============================================================================
// UTILITIES
// ============================================================================

export {
  memo,
  flattenBy,
  uniqueBy,
  keyBy,
  groupBy,
  compareBasic,
  compareAlphanumeric,
  toString,
  defaultGetRowId,
  generateId,
} from './core/utils';
