/**
 * @fileoverview Core type definitions for sng-table-core
 *
 * This file contains all TypeScript interfaces and types used throughout
 * the headless table core. Implemented for Angular signals.
 */

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Represents a state updater function or direct value
 */
export type Updater<T> = T | ((prev: T) => T);

/**
 * Utility to apply an updater (function or direct value)
 */
export function functionalUpdate<T>(updater: Updater<T>, prev: T): T {
  return typeof updater === 'function'
    ? (updater as (prev: T) => T)(prev)
    : updater;
}

/**
 * Deep key accessor type for nested object properties
 */
export type DeepKeys<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? K | `${K}.${DeepKeys<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

/**
 * Gets the value type at a deep key path
 */
export type DeepValue<T, TPath extends string> = TPath extends keyof T
  ? T[TPath]
  : TPath extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? DeepValue<T[K], Rest>
      : never
    : never;

// ============================================================================
// ACCESSOR TYPES
// ============================================================================

/**
 * Function to extract a value from a row's data
 */
export type AccessorFn<TData, TValue = unknown> = (
  originalRow: TData,
  index: number
) => TValue;

/**
 * Key accessor - a string key of the data object
 */
export type AccessorKey<TData> = keyof TData & string;

// ============================================================================
// RENDER TYPES
// ============================================================================

/**
 * Render function for cells/headers - can return string, TemplateRef, or Component
 */
export type ColumnDefTemplate<TProps> = string | ((props: TProps) => unknown);

// ============================================================================
// COLUMN DEFINITION
// ============================================================================

/**
 * Column definition - describes how a column should be rendered and behave
 *
 * @template TData - The type of data in each row
 * @template TValue - The type of value this column produces
 */
export interface ColumnDef<TData, TValue = unknown> {
  /**
   * Unique identifier for this column. Auto-generated from accessorKey if not provided.
   */
  id?: string;

  /**
   * Key to access value from row data (e.g., 'name', 'email')
   */
  accessorKey?: AccessorKey<TData>;

  /**
   * Function to derive value from row data
   */
  accessorFn?: AccessorFn<TData, TValue>;

  /**
   * Header content - string or render function
   */
  header?: ColumnDefTemplate<HeaderContext<TData, TValue>>;

  /**
   * Footer content - string or render function
   */
  footer?: ColumnDefTemplate<HeaderContext<TData, TValue>>;

  /**
   * Cell content - string or render function
   */
  cell?: ColumnDefTemplate<CellContext<TData, TValue>>;

  /**
   * Nested columns for column groups
   */
  columns?: ColumnDef<TData, unknown>[];

  /**
   * Custom metadata for this column
   */
  meta?: Record<string, unknown>;

  // ---- Feature-specific options (added by features) ----

  /** Enable/disable sorting for this column */
  enableSorting?: boolean;
  /** Custom sorting function */
  sortingFn?: SortingFnOption<TData>;
  /** Sort descending first when toggling sort */
  sortDescFirst?: boolean;
  /** How to handle undefined values in sorting */
  sortUndefined?: 'first' | 'last' | false | -1 | 1;
  /** Invert the sorting direction */
  invertSorting?: boolean;

  /** Enable/disable column filtering */
  enableColumnFilter?: boolean;
  /** Custom filter function */
  filterFn?: FilterFnOption<TData>;

  /** Enable/disable global filtering for this column */
  enableGlobalFilter?: boolean;

  /** Enable/disable hiding this column */
  enableHiding?: boolean;

  /** Enable/disable resizing this column */
  enableResizing?: boolean;
  /** Default size in pixels */
  size?: number;
  /** Minimum size in pixels */
  minSize?: number;
  /** Maximum size in pixels */
  maxSize?: number;

  /** Enable/disable pinning this column */
  enablePinning?: boolean;

  /** Enable/disable column ordering (drag to reorder) */
  enableOrdering?: boolean;

  /** Enable/disable grouping by this column */
  enableGrouping?: boolean;
  /** Aggregation function for grouped rows */
  aggregationFn?: AggregationFnOption<TData>;
  /** Aggregated cell renderer */
  aggregatedCell?: ColumnDefTemplate<CellContext<TData, TValue>>;
  /** Function to get grouping value (if different from accessor) */
  getGroupingValue?: (row: TData) => unknown;
}

/**
 * Display column definition - for columns without data accessor (actions, selection, etc.)
 */
export interface DisplayColumnDef<TData, TValue = unknown>
  extends Omit<ColumnDef<TData, TValue>, 'accessorKey' | 'accessorFn'> {
  id: string; // Required for display columns
}

/**
 * Group column definition - for column groups
 */
export interface GroupColumnDef<TData, TValue = unknown>
  extends Omit<ColumnDef<TData, TValue>, 'accessorKey' | 'accessorFn'> {
  columns: ColumnDef<TData, unknown>[];
}

/**
 * Union of all column definition types
 */
export type ColumnDefResolved<TData, TValue = unknown> =
  | ColumnDef<TData, TValue>
  | DisplayColumnDef<TData, TValue>
  | GroupColumnDef<TData, TValue>;

// ============================================================================
// COLUMN INSTANCE
// ============================================================================

/**
 * Column instance - runtime representation of a column
 *
 * @template TData - The type of data in each row
 * @template TValue - The type of value this column produces
 */
export interface Column<TData, TValue = unknown> {
  /** Unique identifier */
  id: string;

  /** The column definition */
  columnDef: ColumnDef<TData, TValue>;

  /** Depth in column group hierarchy (0 = root) */
  depth: number;

  /** Parent column (if nested) */
  parent?: Column<TData, unknown>;

  /** Child columns (if this is a group) */
  columns: Column<TData, unknown>[];

  // ---- Core Methods ----

  /** Get all leaf columns (non-group columns) in this subtree */
  getLeafColumns: () => Column<TData, unknown>[];

  /** Get all columns (including groups) in this subtree flattened */
  getFlatColumns: () => Column<TData, unknown>[];

  /** Get accessor function for this column */
  getAccessorFn: () => AccessorFn<TData, TValue> | undefined;

  /** Get the index of this column among siblings */
  getIndex: (position?: ColumnPinningPosition) => number;

  // ---- Feature APIs (added at runtime by features) ----

  // Sorting
  getCanSort?: () => boolean;
  getIsSorted?: () => false | SortDirection;
  toggleSorting?: (desc?: boolean, isMulti?: boolean) => void;
  clearSorting?: () => void;
  getSortIndex?: () => number;
  getNextSortingOrder?: () => SortDirection | false;
  getAutoSortingFn?: () => SortingFn<TData>;
  getSortingFn?: () => SortingFn<TData>;

  // Filtering
  getCanFilter?: () => boolean;
  getIsFiltered?: () => boolean;
  getFilterValue?: () => unknown;
  setFilterValue?: (value: unknown) => void;
  getFilterIndex?: () => number;
  getAutoFilterFn?: () => FilterFn<TData> | undefined;
  getFilterFn?: () => FilterFn<TData> | undefined;

  // Visibility
  getCanHide?: () => boolean;
  getIsVisible?: () => boolean;
  toggleVisibility?: (value?: boolean) => void;
  getToggleVisibilityHandler?: () => (e: unknown) => void;

  // Sizing
  getCanResize?: () => boolean;
  getIsResizing?: () => boolean;
  getSize?: () => number;
  getStart?: (position?: ColumnPinningPosition) => number;
  resetSize?: () => void;

  // Pinning
  getCanPin?: () => boolean;
  getIsPinned?: () => ColumnPinningPosition;
  getPinnedIndex?: () => number;
  pin?: (position: ColumnPinningPosition) => void;

  // Grouping
  getCanGroup?: () => boolean;
  getIsGrouped?: () => boolean;
  getGroupedIndex?: () => number;
  toggleGrouping?: () => void;
  getToggleGroupingHandler?: () => (e: unknown) => void;
  getAutoAggregationFn?: () => AggregationFn<TData> | undefined;
  getAggregationFn?: () => AggregationFn<TData> | undefined;

  // Faceting
  /** Get rows filtered by all columns except this one (for facet values) */
  getFacetedRowModel?: () => () => Row<TData>[];
  /** Get unique values and their counts for this column */
  getFacetedUniqueValues?: () => () => Map<unknown, number>;
  /** Get min and max values for this column (numeric columns) */
  getFacetedMinMaxValues?: () => () => [number, number] | undefined;

  // Global Filtering
  getCanGlobalFilter?: () => boolean;

  // Column Ordering
  /** Whether this column can be dragged to reorder */
  getCanDrag?: () => boolean;
}

// ============================================================================
// ROW INSTANCE
// ============================================================================

/**
 * Row instance - runtime representation of a data row
 *
 * @template TData - The type of data in each row
 */
export interface Row<TData> {
  /** Unique identifier */
  id: string;

  /** Index in the original data array */
  index: number;

  /** Original data object */
  original: TData;

  /** Depth in row hierarchy (0 = root) */
  depth: number;

  /** Parent row ID (if nested) */
  parentId?: string;

  /** Child rows */
  subRows: Row<TData>[];

  // ---- Core Methods ----

  /** Get cell value by column ID */
  getValue: <TValue = unknown>(columnId: string) => TValue;

  /** Get unique cell values (useful for filtering) */
  getUniqueValues: <TValue = unknown>(columnId: string) => TValue[];

  /** Get cell by column ID */
  getCell: (columnId: string) => Cell<TData, unknown>;

  /** Get all visible cells in order */
  getVisibleCells: () => Cell<TData, unknown>[];

  /** Get all cells including hidden */
  getAllCells: () => Cell<TData, unknown>[];

  /** Get cells for left pinned columns */
  getLeftVisibleCells?: () => Cell<TData, unknown>[];

  /** Get cells for center (unpinned) columns */
  getCenterVisibleCells?: () => Cell<TData, unknown>[];

  /** Get cells for right pinned columns */
  getRightVisibleCells?: () => Cell<TData, unknown>[];

  /** Get parent row (if nested) */
  getParentRow?: () => Row<TData> | undefined;

  /** Get all parent rows */
  getParentRows?: () => Row<TData>[];

  /** Get all leaf (non-group) rows */
  getLeafRows?: () => Row<TData>[];

  // ---- Feature APIs (added at runtime by features) ----

  // Selection
  getIsSelected?: () => boolean;
  getIsSomeSelected?: () => boolean;
  getIsAllSubRowsSelected?: () => boolean;
  getCanSelect?: () => boolean;
  getCanMultiSelect?: () => boolean;
  getCanSelectSubRows?: () => boolean;
  toggleSelected?: (value?: boolean, opts?: { selectChildren?: boolean }) => void;
  getToggleSelectedHandler?: () => (e: unknown) => void;

  // Expanding
  getIsExpanded?: () => boolean;
  getCanExpand?: () => boolean;
  getIsAllParentsExpanded?: () => boolean;
  toggleExpanded?: (value?: boolean) => void;
  getToggleExpandedHandler?: () => (e: unknown) => void;

  // Grouping
  getIsGrouped?: () => boolean;
  getGroupingValue?: (columnId: string) => unknown;
  groupingColumnId?: string;
  groupingValue?: unknown;

  // Pinning
  getIsPinned?: () => RowPinningPosition;
  getCanPin?: () => boolean;
  getPinnedIndex?: () => number;
  pin?: (position: RowPinningPosition, includeLeafRows?: boolean, includeParentRows?: boolean) => void;
}

// ============================================================================
// CELL INSTANCE
// ============================================================================

/**
 * Cell instance - represents a single cell at row/column intersection
 *
 * @template TData - The type of data in each row
 * @template TValue - The type of value in this cell
 */
export interface Cell<TData, TValue = unknown> {
  /** Unique identifier (rowId_columnId) */
  id: string;

  /** The row this cell belongs to */
  row: Row<TData>;

  /** The column this cell belongs to */
  column: Column<TData, TValue>;

  /** Get the raw cell value */
  getValue: () => TValue;

  /** Get rendered value (through cell function or raw) */
  renderValue: () => unknown;

  /** Get the cell context for custom rendering */
  getContext: () => CellContext<TData, TValue>;

  // ---- Feature APIs ----

  /** Whether this cell is a placeholder (for column groups) */
  getIsPlaceholder?: () => boolean;

  /** Whether this cell is aggregated (for grouped rows) */
  getIsAggregated?: () => boolean;

  /** Whether this cell is grouped (is the grouping value cell) */
  getIsGrouped?: () => boolean;
}

// ============================================================================
// HEADER INSTANCE
// ============================================================================

/**
 * Header instance - represents a header cell
 *
 * @template TData - The type of data in each row
 * @template TValue - The type of value in this column
 */
export interface Header<TData, TValue = unknown> {
  /** Unique identifier */
  id: string;

  /** The column this header represents */
  column: Column<TData, TValue>;

  /** Column span (for grouped headers) */
  colSpan: number;

  /** Row span (for grouped headers) */
  rowSpan: number;

  /** Whether this is a placeholder header */
  isPlaceholder: boolean;

  /** Depth in header hierarchy */
  depth: number;

  /** Index among siblings at same depth */
  index: number;

  /** Child headers (for column groups) */
  subHeaders: Header<TData, unknown>[];

  /** Get the header context for custom rendering */
  getContext: () => HeaderContext<TData, TValue>;

  /** Get leaf headers in this subtree */
  getLeafHeaders: () => Header<TData, unknown>[];

  // ---- Feature APIs ----

  // Sizing
  getSize?: () => number;
  getStart?: (position?: ColumnPinningPosition) => number;
  getResizeHandler?: () => (event: unknown) => void;
}

/**
 * Header group - a row of headers
 */
export interface HeaderGroup<TData> {
  /** Unique identifier */
  id: string;

  /** Depth in header hierarchy */
  depth: number;

  /** Headers in this group */
  headers: Header<TData, unknown>[];
}

// ============================================================================
// CONTEXT TYPES
// ============================================================================

/**
 * Context passed to cell render functions
 */
export interface CellContext<TData, TValue = unknown> {
  table: Table<TData>;
  column: Column<TData, TValue>;
  row: Row<TData>;
  cell: Cell<TData, TValue>;
  getValue: () => TValue;
  renderValue: () => unknown;
}

/**
 * Context passed to header/footer render functions
 */
export interface HeaderContext<TData, TValue = unknown> {
  table: Table<TData>;
  column: Column<TData, TValue>;
  header: Header<TData, TValue>;
}

// ============================================================================
// ROW MODEL
// ============================================================================

/**
 * Row model - the result of processing rows through the pipeline
 */
export interface RowModel<TData> {
  /** Processed rows */
  rows: Row<TData>[];

  /** All rows flattened (including sub-rows) */
  flatRows: Row<TData>[];

  /** Map of row ID to row */
  rowsById: Record<string, Row<TData>>;
}

/**
 * Row model factory function type
 */
export type RowModelFn<TData> = (table: Table<TData>) => () => RowModel<TData>;

// ============================================================================
// STATE TYPES
// ============================================================================

/**
 * Sorting state - array of column sort directions
 */
export type SortingState = ColumnSort[];

/**
 * Individual column sort
 */
export interface ColumnSort {
  /** Column ID */
  id: string;
  /** Sort direction */
  desc: boolean;
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Column filters state - array of column filter values
 */
export type ColumnFiltersState = ColumnFilter[];

/**
 * Individual column filter
 */
export interface ColumnFilter {
  /** Column ID */
  id: string;
  /** Filter value */
  value: unknown;
}

/**
 * Pagination state
 */
export interface PaginationState {
  /** Current page index (0-based) */
  pageIndex: number;
  /** Number of rows per page */
  pageSize: number;
}

/**
 * Row selection state - map of row ID to selected state
 */
export type RowSelectionState = Record<string, boolean>;

/**
 * Column visibility state - map of column ID to visibility
 */
export type ColumnVisibilityState = Record<string, boolean>;

/**
 * Column sizing state - map of column ID to size
 */
export type ColumnSizingState = Record<string, number>;

/**
 * Column sizing info - active resize information
 */
export interface ColumnSizingInfoState {
  startOffset: number | null;
  startSize: number | null;
  deltaOffset: number | null;
  deltaPercentage: number | null;
  columnSizingStart: [string, number][];
  isResizingColumn: string | false;
}

/**
 * Column order state - array of column IDs in order
 */
export type ColumnOrderState = string[];

/**
 * Column pinning position
 */
export type ColumnPinningPosition = 'left' | 'right' | false;

/**
 * Column pinning state
 */
export interface ColumnPinningState {
  left?: string[];
  right?: string[];
}

/**
 * Row pinning position
 */
export type RowPinningPosition = 'top' | 'bottom' | false;

/**
 * Row pinning state
 */
export interface RowPinningState {
  top?: string[];
  bottom?: string[];
}

/**
 * Expanded state - map of row ID to expanded, or true for all expanded
 */
export type ExpandedState = Record<string, boolean> | true;

/**
 * Grouping state - array of column IDs to group by
 */
export type GroupingState = string[];

/**
 * Complete table state
 */
export interface TableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
  pagination: PaginationState;
  rowSelection: RowSelectionState;
  columnVisibility: ColumnVisibilityState;
  columnSizing: ColumnSizingState;
  columnSizingInfo: ColumnSizingInfoState;
  columnOrder: ColumnOrderState;
  columnPinning: ColumnPinningState;
  rowPinning: RowPinningState;
  expanded: ExpandedState;
  grouping: GroupingState;
}

/**
 * Initial state - partial table state for initialization
 */
export type InitialTableState = Partial<TableState>;

// ============================================================================
// SORTING FUNCTIONS
// ============================================================================

/**
 * Sorting function type
 */
export type SortingFn<TData> = (
  rowA: Row<TData>,
  rowB: Row<TData>,
  columnId: string
) => number;

/**
 * Built-in sorting function names
 */
export type BuiltInSortingFn =
  | 'alphanumeric'
  | 'alphanumericCaseSensitive'
  | 'text'
  | 'textCaseSensitive'
  | 'datetime'
  | 'basic';

/**
 * Sorting function option - can be function, built-in name, or 'auto'
 */
export type SortingFnOption<TData> =
  | SortingFn<TData>
  | BuiltInSortingFn
  | 'auto';

// ============================================================================
// FILTER FUNCTIONS
// ============================================================================

/**
 * Filter function type
 */
export type FilterFn<TData> = (
  row: Row<TData>,
  columnId: string,
  filterValue: unknown,
  addMeta: (meta: Record<string, unknown>) => void
) => boolean;

/**
 * Built-in filter function names
 */
export type BuiltInFilterFn =
  | 'includesString'
  | 'includesStringSensitive'
  | 'equalsString'
  | 'arrIncludes'
  | 'arrIncludesAll'
  | 'arrIncludesSome'
  | 'equals'
  | 'weakEquals'
  | 'inNumberRange';

/**
 * Filter function option - can be function, built-in name, or 'auto'
 */
export type FilterFnOption<TData> =
  | FilterFn<TData>
  | BuiltInFilterFn
  | 'auto';

/**
 * Filter meta - metadata added during filtering
 */
export type FilterMeta = Record<string, unknown>;

// ============================================================================
// AGGREGATION FUNCTIONS
// ============================================================================

/**
 * Aggregation function type
 */
export type AggregationFn<TData> = (
  columnId: string,
  leafRows: Row<TData>[],
  childRows: Row<TData>[]
) => unknown;

/**
 * Built-in aggregation function names
 */
export type BuiltInAggregationFn =
  | 'sum'
  | 'min'
  | 'max'
  | 'extent'
  | 'mean'
  | 'median'
  | 'unique'
  | 'uniqueCount'
  | 'count';

/**
 * Aggregation function option
 */
export type AggregationFnOption<TData> =
  | AggregationFn<TData>
  | BuiltInAggregationFn
  | 'auto';

// ============================================================================
// TABLE OPTIONS
// ============================================================================

/**
 * Table options - configuration for creating a table instance
 *
 * @template TData - The type of data in each row
 */
export interface TableOptions<TData> {
  // ---- Required ----

  /** The data array to display */
  data: TData[];

  /** Column definitions */
  columns: ColumnDef<TData, unknown>[];

  // ---- Optional Core ----

  /** Default column properties merged with each column def */
  defaultColumn?: Partial<ColumnDef<TData, unknown>>;

  /** Function to generate unique row ID */
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;

  /** Function to get sub-rows for hierarchical data */
  getSubRows?: (originalRow: TData, index: number) => TData[] | undefined;

  // ---- State Management ----

  /** Controlled state (external state management) */
  state?: Partial<TableState>;

  /** Initial state (internal state management) */
  initialState?: InitialTableState;

  /** Callback when any state changes */
  onStateChange?: (updater: Updater<TableState>) => void;

  // ---- Row Models ----

  /** Core row model factory (required) */
  getCoreRowModel: RowModelFn<TData>;

  /** Filtered row model factory */
  getFilteredRowModel?: RowModelFn<TData>;

  /** Sorted row model factory */
  getSortedRowModel?: RowModelFn<TData>;

  /** Paginated row model factory */
  getPaginatedRowModel?: RowModelFn<TData>;

  /** Expanded row model factory */
  getExpandedRowModel?: RowModelFn<TData>;

  /** Grouped row model factory */
  getGroupedRowModel?: RowModelFn<TData>;

  /** Faceted row model factory */
  getFacetedRowModel?: (columnId: string) => RowModelFn<TData>;

  /** Faceted unique values factory */
  getFacetedUniqueValues?: (columnId: string) => () => Map<unknown, number>;

  /** Faceted min/max values factory */
  getFacetedMinMaxValues?: (columnId: string) => () => [number, number] | undefined;

  // ---- Feature Enable/Disable ----

  enableSorting?: boolean;
  enableMultiSort?: boolean;
  enableSortingRemoval?: boolean;
  sortDescFirst?: boolean;
  maxMultiSortColCount?: number;
  isMultiSortEvent?: (e: unknown) => boolean;

  enableFilters?: boolean;
  enableColumnFilters?: boolean;
  enableGlobalFilter?: boolean;
  filterFromLeafRows?: boolean;
  maxLeafRowFilterDepth?: number;
  globalFilterFn?: FilterFnOption<TData>;
  getColumnCanGlobalFilter?: (column: Column<TData, unknown>) => boolean;

  /** Use manual/server-side pagination */
  manualPagination?: boolean;
  /** Total page count (for manual pagination) */
  pageCount?: number;
  /** Auto-reset page index when data changes */
  autoResetPageIndex?: boolean;

  enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
  enableMultiRowSelection?: boolean | ((row: Row<TData>) => boolean);
  enableSubRowSelection?: boolean | ((row: Row<TData>) => boolean);

  enableHiding?: boolean;

  enableColumnResizing?: boolean;
  columnResizeMode?: 'onChange' | 'onEnd';
  columnResizeDirection?: 'ltr' | 'rtl';

  enablePinning?: boolean;
  enableColumnPinning?: boolean;
  enableRowPinning?: boolean | ((row: Row<TData>) => boolean);
  keepPinnedRows?: boolean;

  /** Enable/disable column ordering (drag to reorder columns) */
  enableColumnOrdering?: boolean;

  enableExpanding?: boolean;
  manualExpanding?: boolean;
  autoResetExpanded?: boolean;
  getRowCanExpand?: (row: Row<TData>) => boolean;
  paginateExpandedRows?: boolean;

  enableGrouping?: boolean;
  manualGrouping?: boolean;
  groupedColumnMode?: 'reorder' | 'remove' | false;

  /** Estimated row height in pixels for virtual scrolling */
  virtualScrollEstimatedRowHeight?: number;
  /** Number of rows to render outside visible area (overscan) */
  virtualScrollOverscan?: number;

  // ---- State Change Callbacks ----

  onSortingChange?: (updater: Updater<SortingState>) => void;
  onColumnFiltersChange?: (updater: Updater<ColumnFiltersState>) => void;
  onGlobalFilterChange?: (updater: Updater<string>) => void;
  onPaginationChange?: (updater: Updater<PaginationState>) => void;
  onRowSelectionChange?: (updater: Updater<RowSelectionState>) => void;
  onColumnVisibilityChange?: (updater: Updater<ColumnVisibilityState>) => void;
  onColumnSizingChange?: (updater: Updater<ColumnSizingState>) => void;
  onColumnSizingInfoChange?: (updater: Updater<ColumnSizingInfoState>) => void;
  onColumnOrderChange?: (updater: Updater<ColumnOrderState>) => void;
  onColumnPinningChange?: (updater: Updater<ColumnPinningState>) => void;
  onRowPinningChange?: (updater: Updater<RowPinningState>) => void;
  onExpandedChange?: (updater: Updater<ExpandedState>) => void;
  onGroupingChange?: (updater: Updater<GroupingState>) => void;

  // ---- Other ----

  /** Custom metadata */
  meta?: Record<string, unknown>;

  /** Enable debug logging */
  debugAll?: boolean;
  debugTable?: boolean;
  debugHeaders?: boolean;
  debugColumns?: boolean;
  debugRows?: boolean;

  /** Feature plugins to extend table and row functionality */
  _features?: TableFeature<TData>[];
}

// ============================================================================
// TABLE INSTANCE
// ============================================================================

/**
 * Table instance - the main API for interacting with the table
 *
 * @template TData - The type of data in each row
 */
export interface Table<TData> {
  // ---- Core ----

  /** Get current options (reactive getter) */
  options: TableOptions<TData>;

  /** Set new options */
  setOptions: (newOptions: Updater<TableOptions<TData>>) => void;

  // ---- State ----

  /** Get current state */
  getState: () => TableState;

  /** Set entire state */
  setState: (updater: Updater<TableState>) => void;

  /** Reset state to initial */
  reset: () => void;

  /** Get initial state */
  initialState: TableState;

  // ---- Columns ----

  /** Get all top-level columns */
  getAllColumns: () => Column<TData, unknown>[];

  /** Get all columns flattened (including nested) */
  getAllFlatColumns: () => Column<TData, unknown>[];

  /** Get all leaf columns (no children) */
  getAllLeafColumns: () => Column<TData, unknown>[];

  /** Get column by ID */
  getColumn: (columnId: string) => Column<TData, unknown> | undefined;

  // ---- Headers ----

  /** Get header groups */
  getHeaderGroups: () => HeaderGroup<TData>[];

  /** Get footer groups */
  getFooterGroups: () => HeaderGroup<TData>[];

  /** Get flattened headers */
  getFlatHeaders: () => Header<TData, unknown>[];

  /** Get leaf headers */
  getLeafHeaders: () => Header<TData, unknown>[];

  // ---- Rows ----

  /** Get core row model (unprocessed) */
  getCoreRowModel: () => RowModel<TData>;

  /** Get final row model (after all processing) */
  getRowModel: () => RowModel<TData>;

  /** Get row by ID */
  getRow: (rowId: string, searchAll?: boolean) => Row<TData>;

  // ---- Utilities ----

  /** Internal reset function */
  _reset: () => void;

  // ---- Feature APIs (added at runtime) ----

  // Sorting
  setSorting?: (updater: Updater<SortingState>) => void;
  resetSorting?: (defaultState?: boolean) => void;
  getPreSortedRowModel?: () => RowModel<TData>;
  getSortedRowModel?: () => RowModel<TData>;

  // Filtering
  setColumnFilters?: (updater: Updater<ColumnFiltersState>) => void;
  resetColumnFilters?: (defaultState?: boolean) => void;
  setGlobalFilter?: (updater: Updater<string>) => void;
  resetGlobalFilter?: (defaultState?: boolean) => void;
  getPreFilteredRowModel?: () => RowModel<TData>;
  getFilteredRowModel?: () => RowModel<TData>;

  // Pagination
  setPagination?: (updater: Updater<PaginationState>) => void;
  resetPagination?: (defaultState?: boolean) => void;
  setPageIndex?: (updater: Updater<number>) => void;
  setPageSize?: (updater: Updater<number>) => void;
  getPageCount?: () => number;
  getCanPreviousPage?: () => boolean;
  getCanNextPage?: () => boolean;
  previousPage?: () => void;
  nextPage?: () => void;
  firstPage?: () => void;
  lastPage?: () => void;
  getPageOptions?: () => number[];
  getPrePaginationRowModel?: () => RowModel<TData>;
  getPaginatedRowModel?: () => RowModel<TData>;

  // Row Selection
  setRowSelection?: (updater: Updater<RowSelectionState>) => void;
  resetRowSelection?: (defaultState?: boolean) => void;
  toggleAllRowsSelected?: (value?: boolean) => void;
  toggleAllPageRowsSelected?: (value?: boolean) => void;
  getIsAllRowsSelected?: () => boolean;
  getIsAllPageRowsSelected?: () => boolean;
  getIsSomeRowsSelected?: () => boolean;
  getIsSomePageRowsSelected?: () => boolean;
  getToggleAllRowsSelectedHandler?: () => (event: unknown) => void;
  getToggleAllPageRowsSelectedHandler?: () => (event: unknown) => void;
  getSelectedRowModel?: () => RowModel<TData>;
  getFilteredSelectedRowModel?: () => RowModel<TData>;
  getGroupedSelectedRowModel?: () => RowModel<TData>;

  // Column Visibility
  setColumnVisibility?: (updater: Updater<ColumnVisibilityState>) => void;
  resetColumnVisibility?: (defaultState?: boolean) => void;
  toggleAllColumnsVisible?: (value?: boolean) => void;
  getIsAllColumnsVisible?: () => boolean;
  getIsSomeColumnsVisible?: () => boolean;
  getToggleAllColumnsVisibilityHandler?: () => (event: unknown) => void;
  getVisibleFlatColumns?: () => Column<TData, unknown>[];
  getVisibleLeafColumns?: () => Column<TData, unknown>[];

  // Column Sizing
  setColumnSizing?: (updater: Updater<ColumnSizingState>) => void;
  setColumnSizingInfo?: (updater: Updater<ColumnSizingInfoState>) => void;
  resetColumnSizing?: (defaultState?: boolean) => void;
  getTotalSize?: () => number;
  getLeftTotalSize?: () => number;
  getCenterTotalSize?: () => number;
  getRightTotalSize?: () => number;

  // Column Order
  setColumnOrder?: (updater: Updater<ColumnOrderState>) => void;
  resetColumnOrder?: (defaultState?: boolean) => void;

  // Column Pinning
  setColumnPinning?: (updater: Updater<ColumnPinningState>) => void;
  resetColumnPinning?: (defaultState?: boolean) => void;
  getIsSomeColumnsPinned?: (position?: ColumnPinningPosition) => boolean;
  getLeftLeafColumns?: () => Column<TData, unknown>[];
  getRightLeafColumns?: () => Column<TData, unknown>[];
  getCenterLeafColumns?: () => Column<TData, unknown>[];
  getLeftVisibleLeafColumns?: () => Column<TData, unknown>[];
  getRightVisibleLeafColumns?: () => Column<TData, unknown>[];
  getCenterVisibleLeafColumns?: () => Column<TData, unknown>[];
  getLeftHeaderGroups?: () => HeaderGroup<TData>[];
  getRightHeaderGroups?: () => HeaderGroup<TData>[];
  getCenterHeaderGroups?: () => HeaderGroup<TData>[];
  getLeftFlatHeaders?: () => Header<TData, unknown>[];
  getRightFlatHeaders?: () => Header<TData, unknown>[];
  getCenterFlatHeaders?: () => Header<TData, unknown>[];

  // Row Pinning
  setRowPinning?: (updater: Updater<RowPinningState>) => void;
  resetRowPinning?: (defaultState?: boolean) => void;
  getIsSomeRowsPinned?: (position?: RowPinningPosition) => boolean;
  getTopRows?: () => Row<TData>[];
  getBottomRows?: () => Row<TData>[];
  getCenterRows?: () => Row<TData>[];

  // Expanding
  setExpanded?: (updater: Updater<ExpandedState>) => void;
  resetExpanded?: (defaultState?: boolean) => void;
  toggleAllRowsExpanded?: (value?: boolean) => void;
  getIsAllRowsExpanded?: () => boolean;
  getIsSomeRowsExpanded?: () => boolean;
  getCanSomeRowsExpand?: () => boolean;
  getToggleAllRowsExpandedHandler?: () => (event: unknown) => void;
  getExpandedDepth?: () => number;
  getPreExpandedRowModel?: () => RowModel<TData>;
  getExpandedRowModel?: () => RowModel<TData>;

  // Grouping
  setGrouping?: (updater: Updater<GroupingState>) => void;
  resetGrouping?: (defaultState?: boolean) => void;
  getPreGroupedRowModel?: () => RowModel<TData>;
  getGroupedRowModel?: () => RowModel<TData>;

  // Faceting
  getFacetedRowModel?: (columnId: string) => () => RowModel<TData>;
  getFacetedUniqueValues?: (columnId: string) => () => Map<unknown, number>;
  getFacetedMinMaxValues?: (columnId: string) => () => [number, number] | undefined;

  // Virtualization
  /** Get all rows for virtual scrolling (flat list) */
  getVirtualRows?: () => Row<TData>[];
  /** Get total row count for virtual scroll container */
  getVirtualRowCount?: () => number;
}

// ============================================================================
// FEATURE TYPES
// ============================================================================

/**
 * Feature definition - how features extend the table
 */
export interface TableFeature<TData = unknown> {
  /** Get initial state for this feature */
  getInitialState?: (initialState?: InitialTableState) => Partial<TableState>;

  /** Get default options for this feature */
  getDefaultOptions?: (table: Table<TData>) => Partial<TableOptions<TData>>;

  /** Create column APIs for this feature */
  createColumn?: (
    column: Column<TData, unknown>,
    table: Table<TData>
  ) => void;

  /** Create row APIs for this feature */
  createRow?: (row: Row<TData>, table: Table<TData>) => void;

  /** Create cell APIs for this feature */
  createCell?: (
    cell: Cell<TData, unknown>,
    column: Column<TData, unknown>,
    row: Row<TData>,
    table: Table<TData>
  ) => void;

  /** Create header APIs for this feature */
  createHeader?: (
    header: Header<TData, unknown>,
    table: Table<TData>
  ) => void;

  /** Create table APIs for this feature */
  createTable?: (table: Table<TData>) => void;
}
