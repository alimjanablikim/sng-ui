/**
 * @fileoverview Table factory for sng-table-core
 *
 * The createTable function is the main entry point for creating a table instance.
 * It sets up state management, builds columns, rows, headers, and provides the
 * complete table API.
 */

import { signal, WritableSignal } from '@angular/core';
import {
  Table,
  TableOptions,
  TableState,
  RowModel,
  Row,
  Updater,
  functionalUpdate,
  InitialTableState,
} from './types';
import {
  buildColumns,
  getAllFlatColumns,
  getAllLeafColumns,
  getColumnById,
  orderColumns,
} from './create-column';
import {
  buildHeaderGroups,
  buildFooterGroups,
  getFlatHeaders,
  getLeafHeadersFromGroups,
} from './create-header';
import { memo, debugLog } from './utils';
import { createEmptyRowModel } from '../row-models/core-row-model';

// ============================================================================
// DEFAULT STATE
// ============================================================================

/**
 * Get default initial state
 */
function getDefaultState(): TableState {
  return {
    sorting: [],
    columnFilters: [],
    globalFilter: '',
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
    rowSelection: {},
    columnVisibility: {},
    columnSizing: {},
    columnSizingInfo: {
      startOffset: null,
      startSize: null,
      deltaOffset: null,
      deltaPercentage: null,
      columnSizingStart: [],
      isResizingColumn: false,
    },
    columnOrder: [],
    columnPinning: {
      left: [],
      right: [],
    },
    rowPinning: {
      top: [],
      bottom: [],
    },
    expanded: {},
    grouping: [],
  };
}

/**
 * Merge initial state with defaults
 */
function getInitialState(initialState?: InitialTableState): TableState {
  return {
    ...getDefaultState(),
    ...initialState,
  };
}

// ============================================================================
// TABLE FACTORY
// ============================================================================

/**
 * Create a table instance with reactive state management
 *
 * @param optionsFn - Function that returns table options (allows reactivity)
 * @returns Table instance with full API
 *
 * @example
 * ```typescript
 * import { createTable, getCoreRowModel } from 'sng-ui';
 *
 * @Component({...})
 * export class MyComponent {
 *   data = signal<Person[]>([...]);
 *
 *   table = createTable(() => ({
 *     data: this.data(),
 *     columns: [
 *       { accessorKey: 'name', header: 'Name' },
 *       { accessorKey: 'email', header: 'Email' },
 *     ],
 *     getCoreRowModel: getCoreRowModel(),
 *   }));
 * }
 * ```
 */
export function createTable<TData>(
  optionsFn: () => TableOptions<TData>
): Table<TData> {
  // ========== INTERNAL STATE ==========

  // Store the latest options
  let _options = optionsFn();

  // Internal state signal
  const _state: WritableSignal<TableState> = signal(
    getInitialState(_options.initialState)
  );

  // Store initial state for reset
  const _initialState = getInitialState(_options.initialState);

  // ========== STATE RESOLUTION ==========

  /**
   * Get current state - merges internal state with controlled state from options
   */
  function getState(): TableState {
    // Refresh options to pick up signal changes
    _options = optionsFn();

    const internalState = _state();
    const controlledState = _options.state ?? {};

    // Controlled state takes precedence
    return {
      ...internalState,
      ...controlledState,
    };
  }

  /**
   * Set state - updates internal state and notifies via callback
   */
  function setState(updater: Updater<TableState>): void {
    _state.update((_prev) => {
      const newState = functionalUpdate(updater, getState());
      _options.onStateChange?.(updater);
      return newState;
    });
  }

  /**
   * Reset state to initial
   */
  function reset(): void {
    _state.set(_initialState);
  }

  // ========== COLUMNS ==========

  // Memoized column building
  const _columns = memo(
    () => [_options.columns, _options.defaultColumn],
    () => buildColumns(table, _options.columns),
    {
      debug: _options.debugColumns,
      debugLabel: 'buildColumns',
    }
  );

  // Ordered columns (respects columnOrder state)
  const _orderedColumns = memo(
    () => [_columns(), getState().columnOrder],
    () => orderColumns(_columns(), getState().columnOrder),
    {
      debug: _options.debugColumns,
      debugLabel: 'orderedColumns',
    }
  );

  // All flat columns (including nested)
  const _allFlatColumns = memo(
    () => [_columns()],
    () => getAllFlatColumns(_columns()),
    {
      debug: _options.debugColumns,
      debugLabel: 'allFlatColumns',
    }
  );

  // All leaf columns (no children)
  const _allLeafColumns = memo(
    () => [_columns()],
    () => getAllLeafColumns(_columns()),
    {
      debug: _options.debugColumns,
      debugLabel: 'allLeafColumns',
    }
  );

  // Visible ordered columns (respects columnVisibility state)
  const _visibleOrderedColumns = memo(
    () => [_orderedColumns(), getState().columnVisibility],
    () => {
      const visibility = getState().columnVisibility;
      return _orderedColumns().filter((col) => visibility[col.id] !== false);
    },
    {
      debug: _options.debugColumns,
      debugLabel: 'visibleOrderedColumns',
    }
  );

  // ========== HEADERS ==========

  // Header groups (rows of headers) - uses visible columns
  const _headerGroups = memo(
    () => [_visibleOrderedColumns()],
    () => {
      const groups = buildHeaderGroups(table, _visibleOrderedColumns());
      // Apply features to headers after building
      const features = _options._features ?? [];
      for (const group of groups) {
        for (const header of group.headers) {
          for (const feature of features) {
            if (feature.createHeader) {
              feature.createHeader(header, table);
            }
          }
        }
      }
      return groups;
    },
    {
      debug: _options.debugHeaders,
      debugLabel: 'headerGroups',
    }
  );

  // Footer groups - uses visible columns
  const _footerGroups = memo(
    () => [_visibleOrderedColumns()],
    () => buildFooterGroups(table, _visibleOrderedColumns()),
    {
      debug: _options.debugHeaders,
      debugLabel: 'footerGroups',
    }
  );

  // Flat headers
  const _flatHeaders = memo(
    () => [_headerGroups()],
    () => getFlatHeaders(_headerGroups()),
    {
      debug: _options.debugHeaders,
      debugLabel: 'flatHeaders',
    }
  );

  // Leaf headers
  const _leafHeaders = memo(
    () => [_headerGroups()],
    () => getLeafHeadersFromGroups(_headerGroups()),
    {
      debug: _options.debugHeaders,
      debugLabel: 'leafHeaders',
    }
  );

  // ========== ROW MODELS ==========

  // Core row model (unprocessed rows from data)
  const _coreRowModel = memo(
    () => [_options.data, _options.getRowId, _options.getSubRows],
    () => {
      if (!_options.getCoreRowModel) {
        debugLog(
          _options.debugRows,
          'getCoreRowModel',
          'No getCoreRowModel provided'
        );
        return createEmptyRowModel<TData>();
      }
      return _options.getCoreRowModel(table)();
    },
    {
      debug: _options.debugRows,
      debugLabel: 'coreRowModel',
    }
  );

  // Cache for row model memos (created lazily)
  let _filteredRowModelMemo: (() => RowModel<TData>) | null = null;
  let _groupedRowModelMemo: (() => RowModel<TData>) | null = null;
  let _sortedRowModelMemo: (() => RowModel<TData>) | null = null;
  let _expandedRowModelMemo: (() => RowModel<TData>) | null = null;
  let _paginatedRowModelMemo: (() => RowModel<TData>) | null = null;

  // Get or create filtered row model memo
  const getFilteredRowModelMemo = () => {
    if (!_filteredRowModelMemo && _options.getFilteredRowModel) {
      _filteredRowModelMemo = _options.getFilteredRowModel(table);
    }
    return _filteredRowModelMemo;
  };

  // Get or create grouped row model memo
  const getGroupedRowModelMemo = () => {
    if (!_groupedRowModelMemo && _options.getGroupedRowModel) {
      _groupedRowModelMemo = _options.getGroupedRowModel(table);
    }
    return _groupedRowModelMemo;
  };

  // Get or create sorted row model memo
  const getSortedRowModelMemo = () => {
    if (!_sortedRowModelMemo && _options.getSortedRowModel) {
      _sortedRowModelMemo = _options.getSortedRowModel(table);
    }
    return _sortedRowModelMemo;
  };

  // Get or create expanded row model memo
  const getExpandedRowModelMemo = () => {
    if (!_expandedRowModelMemo && _options.getExpandedRowModel) {
      _expandedRowModelMemo = _options.getExpandedRowModel(table);
    }
    return _expandedRowModelMemo;
  };

  // Get or create paginated row model memo
  const getPaginatedRowModelMemo = () => {
    if (!_paginatedRowModelMemo && _options.getPaginatedRowModel) {
      _paginatedRowModelMemo = _options.getPaginatedRowModel(table);
    }
    return _paginatedRowModelMemo;
  };

  // ========== TABLE INSTANCE ==========

  const table: Table<TData> = {
    // Options - re-evaluate optionsFn to pick up signal changes
    get options() {
      _options = optionsFn();
      return _options;
    },

    setOptions: (newOptions: Updater<TableOptions<TData>>) => {
      _options = functionalUpdate(newOptions, _options);
    },

    // State
    getState,
    setState,
    reset,
    initialState: _initialState,

    // Columns
    getAllColumns: () => _columns(),
    getAllFlatColumns: () => _allFlatColumns(),
    getAllLeafColumns: () => _allLeafColumns(),
    getColumn: (columnId: string) => getColumnById(_allFlatColumns(), columnId),

    // Headers
    getHeaderGroups: () => _headerGroups(),
    getFooterGroups: () => _footerGroups(),
    getFlatHeaders: () => _flatHeaders(),
    getLeafHeaders: () => _leafHeaders(),

    // Rows
    getCoreRowModel: () => _coreRowModel(),
    getRowModel: () => getRowModel(
      table,
      getFilteredRowModelMemo,
      getGroupedRowModelMemo,
      getSortedRowModelMemo,
      getExpandedRowModelMemo,
      getPaginatedRowModelMemo
    ),
    getRow: (rowId: string, searchAll?: boolean) => getRow(table, rowId, searchAll),

    // Internal
    _reset: reset,
  };

  // ========== UPDATE OPTIONS ==========

  // Set initial reference to table in closure
  // This allows options function to be reactive if it reads signals
  // @internal Reserved for future reactive options support
  const _updateOptions = () => {
    const newOptions = optionsFn();
    if (newOptions !== _options) {
      _options = newOptions;
    }
  };

  // ========== APPLY FEATURES ==========

  // Apply features' createTable methods to add table-level APIs
  const features = _options._features ?? [];
  for (const feature of features) {
    if (feature.createTable) {
      feature.createTable(table);
    }
  }

  // Apply features' createColumn methods to all columns
  const applyFeaturesToColumns = () => {
    const allColumns = _allFlatColumns();
    for (const column of allColumns) {
      for (const feature of features) {
        if (feature.createColumn) {
          feature.createColumn(column, table);
        }
      }
    }
  };

  // Apply features to columns now
  applyFeaturesToColumns();

  // Note: Features are applied to headers during header group building (in _headerGroups memo)

  // ========== RETURN TABLE ==========

  return table;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the final row model after all processing
 * This follows the pipeline: core -> filtered -> grouped -> sorted -> expanded -> paginated
 *
 * Uses cached memo functions from table closure to ensure memoization works
 */
function getRowModel<TData>(
  table: Table<TData>,
  getFilteredMemo: () => (() => RowModel<TData>) | null,
  getGroupedMemo: () => (() => RowModel<TData>) | null,
  getSortedMemo: () => (() => RowModel<TData>) | null,
  getExpandedMemo: () => (() => RowModel<TData>) | null,
  getPaginatedMemo: () => (() => RowModel<TData>) | null
): RowModel<TData> {
  // Start with core row model
  let rowModel = table.getCoreRowModel();

  // Apply filtered row model if available
  const filteredMemo = getFilteredMemo();
  if (filteredMemo) {
    const filteredModel = filteredMemo();
    if (filteredModel) {
      rowModel = filteredModel;
    }
  }

  // Apply grouped row model if available
  const groupedMemo = getGroupedMemo();
  if (groupedMemo) {
    const groupedModel = groupedMemo();
    if (groupedModel) {
      rowModel = groupedModel;
    }
  }

  // Apply sorted row model if available
  const sortedMemo = getSortedMemo();
  if (sortedMemo) {
    const sortedModel = sortedMemo();
    if (sortedModel) {
      rowModel = sortedModel;
    }
  }

  // Apply expanded row model if available
  const expandedMemo = getExpandedMemo();
  if (expandedMemo) {
    const expandedModel = expandedMemo();
    if (expandedModel) {
      rowModel = expandedModel;
    }
  }

  // Apply paginated row model if available
  const paginatedMemo = getPaginatedMemo();
  if (paginatedMemo) {
    const paginatedModel = paginatedMemo();
    if (paginatedModel) {
      rowModel = paginatedModel;
    }
  }

  return rowModel;
}

/**
 * Get a row by ID
 */
function getRow<TData>(
  table: Table<TData>,
  rowId: string,
  searchAll = false
): Row<TData> {
  // Search in current row model first
  const rowModel = searchAll ? table.getCoreRowModel() : table.getRowModel();
  const row = rowModel.rowsById[rowId];

  if (row) {
    return row;
  }

  // If not found and we weren't searching all, try core model
  if (!searchAll) {
    const coreRow = table.getCoreRowModel().rowsById[rowId];
    if (coreRow) {
      return coreRow;
    }
  }

  throw new Error(`[sng-table] Row with id "${rowId}" not found`);
}
