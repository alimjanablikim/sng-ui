# Table

A powerful data table with Angular signals. Features a headless core (`sng-table-core`) for logic and styled UI components (`sng-table`) for presentation.

## Installation

```bash
npx @shadng/sng-ui add table
```

## Basic Usage

```typescript
import { signal } from '@angular/core';
import {
  createTable,
  getCoreRowModel,
  SngTable,
  SngTableHeader,
  SngTableBody,
  SngTableRow,
  SngTableHead,
  SngTableCell,
  type ColumnDef,
} from 'sng-ui';

interface Payment {
  id: string;
  amount: number;
  status: string;
  email: string;
}

const columns: ColumnDef<Payment>[] = [
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'amount', header: 'Amount' },
];

// In component
data = signal<Payment[]>([...]);

table = createTable<Payment>(() => ({
  data: this.data(),
  columns,
  getCoreRowModel: getCoreRowModel(),
}));
```

```html
<sng-table>
  <sng-table-header>
    @for (headerGroup of table.getHeaderGroups(); track headerGroup.id) {
      <sng-table-row>
        @for (header of headerGroup.headers; track header.id) {
          <sng-table-head>{{ header.column.columnDef.header }}</sng-table-head>
        }
      </sng-table-row>
    }
  </sng-table-header>
  <sng-table-body>
    @for (row of table.getRowModel().rows; track row.id) {
      <sng-table-row>
        @for (cell of row.getVisibleCells(); track cell.id) {
          <sng-table-cell>{{ cell.getValue() }}</sng-table-cell>
        }
      </sng-table-row>
    }
  </sng-table-body>
</sng-table>
```

## Headless Core

The `sng-table-core` is the engine behind the styled table components. Use it directly when you need complete control over rendering or want to build custom table UI.

### Why Use Headless Core?

- **Custom UI** - Build tables with any HTML/CSS framework, not just our styled components
- **Framework Flexibility** - Works with any Angular template, including CDK virtual scroll
- **Smaller Bundle** - Import only the features you need
- **Full Control** - Access every piece of table state and logic

### Core Exports

```typescript
import {
  // Table factory
  createTable,

  // Row models (import only what you need)
  getCoreRowModel,      // Required - base row processing
  getSortedRowModel,    // Sorting
  getFilteredRowModel,  // Column filtering
  getPaginatedRowModel, // Pagination
  getExpandedRowModel,  // Row expansion
  getGroupedRowModel,   // Row grouping

  // Types
  type ColumnDef,
  type Table,
  type Row,
  type Column,
} from 'sng-ui';
```

### Headless Example

Build a table with plain HTML - no styled components:

```typescript
@Component({
  template: `
    <table>
      <thead>
        @for (hg of table.getHeaderGroups(); track hg.id) {
          <tr>
            @for (h of hg.headers; track h.id) {
              <th (click)="h.column.toggleSorting?.()">
                {{ h.column.columnDef.header }}
                {{ h.column.getIsSorted?.() === 'asc' ? 'up' : h.column.getIsSorted?.() === 'desc' ? 'down' : '' }}
              </th>
            }
          </tr>
        }
      </thead>
      <tbody>
        @for (row of table.getRowModel().rows; track row.id) {
          <tr>
            @for (cell of row.getVisibleCells(); track cell.id) {
              <td>{{ cell.getValue() }}</td>
            }
          </tr>
        }
      </tbody>
    </table>
  `
})
export class HeadlessTableExample {
  data = signal([...]);
  sorting = signal<SortingState>([]);

  table = createTable(() => ({
    data: this.data(),
    columns: [...],
    state: { sorting: this.sorting() },
    onSortingChange: (updater) => {
      this.sorting.update(s => typeof updater === 'function' ? updater(s) : updater);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  }));
}
```

### When to Use What

| Use Case | Recommendation |
|----------|----------------|
| Standard data tables | Styled components (`SngTable`, etc.) |
| Custom design system | Headless core + your own components |
| CDK virtual scroll | Headless core + `CdkVirtualScrollViewport` |
| Server-side rendering | Headless core (no DOM dependencies) |
| Non-table layouts | Headless core (cards, lists, grids) |

---

# Technical Reference

Complete API reference for the SngTable component and sng-table-core utilities.

## Component Architecture

```typescript
// 2-layer architecture: headless core + styled components

// LAYER 1: sng-table-core (headless)
// - createTable<TData>()        - Creates reactive table instance
// - getCoreRowModel()           - Base row processing
// - getSortedRowModel()         - Sorting pipeline
// - getFilteredRowModel()       - Filtering pipeline
// - getPaginationRowModel()     - Pagination pipeline
// - getGroupedRowModel()        - Grouping pipeline
// - getExpandedRowModel()       - Expansion pipeline
// - getFacetedRowModel()        - Faceting pipeline

// LAYER 2: sng-ui styled components (8 components)
// 1. SngTable          - Root <table> wrapper with styling
// 2. SngTableHeader    - <thead> container
// 3. SngTableBody      - <tbody> container
// 4. SngTableFooter    - <tfoot> container
// 5. SngTableRow       - <tr> with hover/selection states
// 6. SngTableHead      - <th> header cell with sort indicators
// 7. SngTableCell      - <td> data cell
// 8. SngTableCaption   - <caption> for accessibility

// The separation allows:
// - Full control over rendering (no framework magic)
// - Custom UI with any styling system
// - Server-side rendering support
// - Tree-shakeable feature imports
```

## Core Concepts

```typescript
// The table is created with createTable() which takes a reactive options function
const table = createTable<TData>(() => ({
  data: this.data(),           // Reactive data signal
  columns: columns,            // Column definitions (static)
  state: { ... },              // Managed state (sorting, filtering, etc.)
  onStateChange: (updater) => { ... },  // State change handlers
  getCoreRowModel: getCoreRowModel(),   // Required row model
  // Add more row models and features as needed
}));

// Key methods on the table instance:
table.getHeaderGroups()     // Get header groups for rendering
table.getRowModel()         // Get the current row model (after all processing)
table.getCoreRowModel()     // Get the base row model (before processing)
table.getAllLeafColumns()   // Get all leaf columns
table.getColumn(id)         // Get a column by ID
table.getRow(id)            // Get a row by ID
table.getState()            // Get current state
table.setState(updater)     // Update state
```

## Column Definitions

```typescript
interface ColumnDef<TData, TValue = unknown> {
  // Identity
  id?: string;                          // Column ID (auto-generated from accessorKey if not provided)

  // Data Access
  accessorKey?: keyof TData;            // Simple property access
  accessorFn?: (row: TData) => TValue;  // Custom accessor function

  // Display
  header?: string | ((ctx) => unknown); // Header content
  cell?: string | ((ctx) => unknown);   // Cell content
  footer?: string | ((ctx) => unknown); // Footer content

  // Feature flags (per-column overrides)
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableHiding?: boolean;
  enableResizing?: boolean;
  enablePinning?: boolean;
  enableGrouping?: boolean;

  // Sorting
  sortingFn?: SortingFnOption;
  sortDescFirst?: boolean;
  invertSorting?: boolean;

  // Filtering
  filterFn?: FilterFnOption;

  // Grouping
  aggregationFn?: AggregationFnOption;
  getGroupingValue?: (row: TData) => unknown;

  // Sizing
  size?: number;
  minSize?: number;
  maxSize?: number;
}
```

## Row Models Pipeline

```typescript
// Row models form a pipeline: core -> filtered -> sorted -> grouped -> expanded -> paginated
// Each stage transforms the rows from the previous stage

// Always required - provides base row data
getCoreRowModel: getCoreRowModel()

// Add based on features needed (order matters!)
getFilteredRowModel: getFilteredRowModel()   // After core
getSortedRowModel: getSortedRowModel()       // After filtered
getGroupedRowModel: getGroupedRowModel()     // After sorted
getExpandedRowModel: getExpandedRowModel()   // After grouped
getPaginatedRowModel: getPaginatedRowModel() // After expanded (last)

// Example with all row models:
table = createTable<TData>(() => ({
  data: this.data(),
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  // ... state and handlers
}));
```

## Sorting Feature

```typescript
import { createSortingFeature, getSortedRowModel, type SortingState } from 'sng-ui';

// State signal
sorting = signal<SortingState>([]);

// Table configuration
table = createTable<TData>(() => ({
  data: this.data(),
  columns,
  state: { sorting: this.sorting() },
  onSortingChange: (updater) => {
    this.sorting.update(prev => typeof updater === 'function' ? updater(prev) : updater);
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  _features: [createSortingFeature()],
}));

// Column-level sorting options
const columns: ColumnDef<TData>[] = [
  {
    accessorKey: 'name',
    enableSorting: true,                    // Enable sorting (default: true)
    sortingFn: 'alphanumeric',              // Built-in: 'alphanumeric', 'text', 'datetime', 'basic'
    sortDescFirst: false,                   // Start with ascending (default)
    invertSorting: false,                   // Don't invert sort direction
  },
];

// Table-level sorting options
enableSorting: true,           // Enable sorting globally
enableMultiSort: true,         // Allow sorting by multiple columns
enableSortingRemoval: true,    // Allow removing sort (3-state: asc -> desc -> none)
maxMultiSortColCount: 3,       // Max columns for multi-sort

// Template usage - click header to sort
<sng-table-head (click)="header.column.toggleSorting()">
  {{ header.column.columnDef.header }}
  @if (header.column.getIsSorted() === 'asc') { up }
  @if (header.column.getIsSorted() === 'desc') { down }
</sng-table-head>

// Sorting methods on column
column.toggleSorting(desc?, multi?)  // Toggle sort direction
column.getIsSorted()                 // Returns 'asc' | 'desc' | false
column.getSortIndex()                // Index in multi-sort (-1 if not sorted)
column.clearSorting()                // Remove this column from sort
```

## Filtering Feature

```typescript
import {
  createColumnFilteringFeature,
  createGlobalFilteringFeature,
  getFilteredRowModel,
  type ColumnFiltersState,
} from 'sng-ui';

// Column filtering state
columnFilters = signal<ColumnFiltersState>([]);

// Global filtering state
globalFilter = signal<string>('');

// Table configuration
table = createTable<TData>(() => ({
  data: this.data(),
  columns,
  state: {
    columnFilters: this.columnFilters(),
    globalFilter: this.globalFilter(),
  },
  onColumnFiltersChange: (updater) => {
    this.columnFilters.update(prev => typeof updater === 'function' ? updater(prev) : updater);
  },
  onGlobalFilterChange: (updater) => {
    this.globalFilter.update(prev => typeof updater === 'function' ? updater(prev) : updater);
  },
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  _features: [createColumnFilteringFeature(), createGlobalFilteringFeature()],
}));

// Column-level filter options
const columns: ColumnDef<TData>[] = [
  {
    accessorKey: 'status',
    enableColumnFilter: true,
    filterFn: 'includesString',  // Built-in filter functions
    // Built-in filterFn options:
    // 'includesString', 'includesStringSensitive'
    // 'equalsString', 'equalsStringSensitive'
    // 'arrIncludes', 'arrIncludesAll', 'arrIncludesSome'
    // 'equals', 'weakEquals', 'inNumberRange'
  },
];

// Template usage
<input
  type="text"
  [value]="table.getColumn('email')?.getFilterValue() ?? ''"
  (input)="table.getColumn('email')?.setFilterValue($event.target.value)"
  placeholder="Filter emails..."
/>

// Global filter input
<input
  type="text"
  [value]="globalFilter()"
  (input)="globalFilter.set($event.target.value)"
  placeholder="Search all columns..."
/>

// Filtering methods
column.setFilterValue(value)    // Set filter value for column
column.getFilterValue()         // Get current filter value
table.setGlobalFilter(value)    // Set global filter
table.getFilteredRowModel()     // Get filtered rows
```

## Pagination Feature

```typescript
import { createPaginationFeature, getPaginationRowModel, type PaginationState } from 'sng-ui';

// Pagination state
pagination = signal<PaginationState>({ pageIndex: 0, pageSize: 10 });

// Table configuration
table = createTable<TData>(() => ({
  data: this.data(),
  columns,
  state: { pagination: this.pagination() },
  onPaginationChange: (updater) => {
    this.pagination.update(prev => typeof updater === 'function' ? updater(prev) : updater);
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  _features: [createPaginationFeature()],
}));

// Pagination methods
table.setPageIndex(index)       // Go to specific page
table.setPageSize(size)         // Change page size
table.nextPage()                // Go to next page
table.previousPage()            // Go to previous page
table.firstPage()               // Go to first page
table.lastPage()                // Go to last page
table.getCanNextPage()          // Check if next page exists
table.getCanPreviousPage()      // Check if previous page exists
table.getPageCount()            // Total number of pages
table.getRowCount()             // Total number of rows

// Template usage
<div class="pagination">
  <button (click)="table.firstPage()" [disabled]="!table.getCanPreviousPage()"><<</button>
  <button (click)="table.previousPage()" [disabled]="!table.getCanPreviousPage()"><</button>
  <span>Page {{ pagination().pageIndex + 1 }} of {{ table.getPageCount() }}</span>
  <button (click)="table.nextPage()" [disabled]="!table.getCanNextPage()">></button>
  <button (click)="table.lastPage()" [disabled]="!table.getCanNextPage()">>></button>
</div>

<select (change)="table.setPageSize($event.target.value)">
  <option value="10">10 per page</option>
  <option value="20">20 per page</option>
  <option value="50">50 per page</option>
</select>
```

## Row Selection Feature

```typescript
import { createRowSelectionFeature, type RowSelectionState } from 'sng-ui';

// Selection state - Record<rowId, boolean>
rowSelection = signal<RowSelectionState>({});

// Table configuration
table = createTable<TData>(() => ({
  data: this.data(),
  columns,
  state: { rowSelection: this.rowSelection() },
  onRowSelectionChange: (updater) => {
    this.rowSelection.update(prev => typeof updater === 'function' ? updater(prev) : updater);
  },
  enableRowSelection: true,              // Enable selection
  enableMultiRowSelection: true,         // Allow multiple selection
  getRowId: (row) => row.id,             // Custom row ID (important for selection)
  getCoreRowModel: getCoreRowModel(),
  _features: [createRowSelectionFeature()],
}));

// Selection methods
row.toggleSelected()              // Toggle row selection
row.getIsSelected()               // Check if row is selected
row.getCanSelect()                // Check if row can be selected
table.toggleAllRowsSelected()     // Toggle all rows
table.getIsAllRowsSelected()      // Check if all selected
table.getIsSomeRowsSelected()     // Check if some selected
table.getSelectedRowModel()       // Get selected rows

// Template with checkbox column
const columns: ColumnDef<TData>[] = [
  {
    id: 'select',
    header: ({ table }) => `
      <input type="checkbox"
        [checked]="table.getIsAllRowsSelected()"
        [indeterminate]="table.getIsSomeRowsSelected()"
        (change)="table.toggleAllRowsSelected()" />
    `,
    cell: ({ row }) => `
      <input type="checkbox"
        [checked]="row.getIsSelected()"
        [disabled]="!row.getCanSelect()"
        (change)="row.toggleSelected()" />
    `,
  },
  // ... other columns
];

// Get selected data
getSelectedData() {
  return table.getSelectedRowModel().rows.map(row => row.original);
}
```

## Column Visibility Feature

```typescript
import { createColumnVisibilityFeature, type ColumnVisibilityState } from 'sng-ui';

// Visibility state - Record<columnId, boolean>
columnVisibility = signal<ColumnVisibilityState>({});

// Table configuration
table = createTable<TData>(() => ({
  data: this.data(),
  columns,
  state: { columnVisibility: this.columnVisibility() },
  onColumnVisibilityChange: (updater) => {
    this.columnVisibility.update(prev => typeof updater === 'function' ? updater(prev) : updater);
  },
  getCoreRowModel: getCoreRowModel(),
  _features: [createColumnVisibilityFeature()],
}));

// Visibility methods
column.toggleVisibility()         // Toggle column visibility
column.getIsVisible()             // Check if visible
column.getCanHide()               // Check if can be hidden
table.getAllLeafColumns()         // Get all columns for visibility menu
table.getVisibleLeafColumns()     // Get only visible columns

// Template - column visibility dropdown
<div class="dropdown">
  <button>Columns</button>
  <div class="dropdown-menu">
    @for (column of table.getAllLeafColumns(); track column.id) {
      @if (column.getCanHide()) {
        <label>
          <input type="checkbox"
            [checked]="column.getIsVisible()"
            (change)="column.toggleVisibility()" />
          {{ column.columnDef.header }}
        </label>
      }
    }
  </div>
</div>

// Programmatic visibility
hideColumn(columnId: string) {
  this.columnVisibility.update(prev => ({ ...prev, [columnId]: false }));
}

showColumn(columnId: string) {
  this.columnVisibility.update(prev => ({ ...prev, [columnId]: true }));
}
```

## Column Ordering Feature

```typescript
import { createColumnOrderingFeature, type ColumnOrderState } from 'sng-ui';

// Order state - array of column IDs
columnOrder = signal<ColumnOrderState>([]);

// Table configuration
table = createTable<TData>(() => ({
  data: this.data(),
  columns,
  state: { columnOrder: this.columnOrder() },
  onColumnOrderChange: (updater) => {
    this.columnOrder.update(prev => typeof updater === 'function' ? updater(prev) : updater);
  },
  getCoreRowModel: getCoreRowModel(),
  _features: [createColumnOrderingFeature()],
}));

// Ordering methods
table.setColumnOrder(order)       // Set column order array
table.resetColumnOrder()          // Reset to default order

// Drag and drop implementation
onDragStart(columnId: string) {
  this.draggedColumn = columnId;
}

onDrop(targetColumnId: string) {
  const currentOrder = this.columnOrder().length
    ? this.columnOrder()
    : table.getAllLeafColumns().map(c => c.id);

  const dragIndex = currentOrder.indexOf(this.draggedColumn);
  const dropIndex = currentOrder.indexOf(targetColumnId);

  const newOrder = [...currentOrder];
  newOrder.splice(dragIndex, 1);
  newOrder.splice(dropIndex, 0, this.draggedColumn);

  this.columnOrder.set(newOrder);
}
```

## Column Sizing Feature

```typescript
import { createColumnSizingFeature, type ColumnSizingState } from 'sng-ui';

// Sizing state - Record<columnId, number>
columnSizing = signal<ColumnSizingState>({});

// Table configuration
table = createTable<TData>(() => ({
  data: this.data(),
  columns,
  state: { columnSizing: this.columnSizing() },
  onColumnSizingChange: (updater) => {
    this.columnSizing.update(prev => typeof updater === 'function' ? updater(prev) : updater);
  },
  columnResizeMode: 'onChange',    // 'onChange' or 'onEnd'
  getCoreRowModel: getCoreRowModel(),
  _features: [createColumnSizingFeature()],
}));

// Column sizing options
const columns: ColumnDef<TData>[] = [
  {
    accessorKey: 'name',
    size: 200,       // Default size
    minSize: 100,    // Minimum size
    maxSize: 400,    // Maximum size
    enableResizing: true,
  },
];

// Sizing methods
column.getSize()                  // Get current size
column.getCanResize()             // Check if resizable
header.getResizeHandler()         // Get resize handler for drag

// Template with resize handle
<sng-table-head [style.width.px]="header.column.getSize()">
  {{ header.column.columnDef.header }}
  @if (header.column.getCanResize()) {
    <div
      class="resize-handle"
      (mousedown)="header.getResizeHandler()($event)"
      (touchstart)="header.getResizeHandler()($event)">
    </div>
  }
</sng-table-head>
```

## Column Pinning Feature

```typescript
import { createColumnPinningFeature, type ColumnPinningState } from 'sng-ui';

// Pinning state
columnPinning = signal<ColumnPinningState>({ left: [], right: [] });

// Table configuration
table = createTable<TData>(() => ({
  data: this.data(),
  columns,
  state: { columnPinning: this.columnPinning() },
  onColumnPinningChange: (updater) => {
    this.columnPinning.update(prev => typeof updater === 'function' ? updater(prev) : updater);
  },
  getCoreRowModel: getCoreRowModel(),
  _features: [createColumnPinningFeature()],
}));

// Pinning methods
column.pin('left')                // Pin to left
column.pin('right')               // Pin to right
column.pin(false)                 // Unpin
column.getIsPinned()              // Returns 'left' | 'right' | false
table.getLeftLeafColumns()        // Get left-pinned columns
table.getRightLeafColumns()       // Get right-pinned columns
table.getCenterLeafColumns()      // Get unpinned columns

// Template with pinned columns
<sng-table-row>
  <!-- Left pinned -->
  @for (cell of row.getLeftVisibleCells(); track cell.id) {
    <sng-table-cell class="sticky left-0 bg-background">
      {{ cell.getValue() }}
    </sng-table-cell>
  }
  <!-- Center (scrollable) -->
  @for (cell of row.getCenterVisibleCells(); track cell.id) {
    <sng-table-cell>{{ cell.getValue() }}</sng-table-cell>
  }
  <!-- Right pinned -->
  @for (cell of row.getRightVisibleCells(); track cell.id) {
    <sng-table-cell class="sticky right-0 bg-background">
      {{ cell.getValue() }}
    </sng-table-cell>
  }
</sng-table-row>
```

## Row Pinning Feature

```typescript
import { createRowPinningFeature, type RowPinningState } from 'sng-ui';

// Row pinning state
rowPinning = signal<RowPinningState>({ top: [], bottom: [] });

// Table configuration
table = createTable<TData>(() => ({
  data: this.data(),
  columns,
  state: { rowPinning: this.rowPinning() },
  onRowPinningChange: (updater) => {
    this.rowPinning.update(prev => typeof updater === 'function' ? updater(prev) : updater);
  },
  enableRowPinning: true,
  keepPinnedRows: true,           // Keep pinned rows when filtered out
  getCoreRowModel: getCoreRowModel(),
  _features: [createRowPinningFeature()],
}));

// Row pinning methods
row.pin('top')                    // Pin to top
row.pin('bottom')                 // Pin to bottom
row.pin(false)                    // Unpin
row.getIsPinned()                 // Returns 'top' | 'bottom' | false
table.getTopRows()                // Get top-pinned rows
table.getBottomRows()             // Get bottom-pinned rows
table.getCenterRows()             // Get unpinned rows

// Template with pinned rows
<sng-table>
  <!-- Top pinned rows (sticky) -->
  @if (table.getTopRows().length > 0) {
    <sng-table-header class="sticky top-0 bg-blue-50">
      @for (row of table.getTopRows(); track row.id) {
        <sng-table-row>...</sng-table-row>
      }
    </sng-table-header>
  }

  <!-- Regular rows -->
  <sng-table-body>
    @for (row of table.getCenterRows(); track row.id) {
      <sng-table-row>...</sng-table-row>
    }
  </sng-table-body>

  <!-- Bottom pinned rows (sticky) -->
  @if (table.getBottomRows().length > 0) {
    <sng-table-footer class="sticky bottom-0 bg-green-50">
      @for (row of table.getBottomRows(); track row.id) {
        <sng-table-row>...</sng-table-row>
      }
    </sng-table-footer>
  }
</sng-table>
```

## Row Expanding Feature

```typescript
import { createRowExpandingFeature, getExpandedRowModel, type ExpandedState } from 'sng-ui';

// Expanded state - true (all) or Record<rowId, boolean>
expanded = signal<ExpandedState>({});

// Table configuration with sub-rows
table = createTable<TData>(() => ({
  data: this.data(),
  columns,
  state: { expanded: this.expanded() },
  onExpandedChange: (updater) => {
    this.expanded.update(prev => typeof updater === 'function' ? updater(prev) : updater);
  },
  getSubRows: (row) => row.subRows,  // Function to get sub-rows
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  _features: [createRowExpandingFeature()],
}));

// Expanding methods
row.toggleExpanded()              // Toggle row expansion
row.getIsExpanded()               // Check if expanded
row.getCanExpand()                // Check if has sub-rows
row.subRows                       // Access sub-rows
row.depth                         // Nesting depth (0 = top level)
table.toggleAllRowsExpanded()     // Toggle all rows
table.getIsAllRowsExpanded()      // Check if all expanded
table.getExpandedDepth()          // Get max expanded depth

// Template with expandable rows
<sng-table-cell>
  <div [style.padding-left.px]="row.depth * 20">
    @if (row.getCanExpand()) {
      <button (click)="row.toggleExpanded()">
        {{ row.getIsExpanded() ? 'v' : '>' }}
      </button>
    }
    {{ cell.getValue() }}
  </div>
</sng-table-cell>
```

## Row Grouping Feature

```typescript
import {
  createRowGroupingFeature,
  getGroupedRowModel,
  getExpandedRowModel,
  type GroupingState,
} from 'sng-ui';

// Grouping state - array of column IDs to group by
grouping = signal<GroupingState>([]);
expanded = signal<ExpandedState>({});

// Table configuration
table = createTable<TData>(() => ({
  data: this.data(),
  columns,
  state: {
    grouping: this.grouping(),
    expanded: this.expanded(),
  },
  onGroupingChange: (updater) => {
    this.grouping.update(prev => typeof updater === 'function' ? updater(prev) : updater);
  },
  onExpandedChange: (updater) => {
    this.expanded.update(prev => typeof updater === 'function' ? updater(prev) : updater);
  },
  getCoreRowModel: getCoreRowModel(),
  getGroupedRowModel: getGroupedRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  _features: [createRowGroupingFeature(), createRowExpandingFeature()],
}));

// Column aggregation options
const columns: ColumnDef<TData>[] = [
  {
    accessorKey: 'amount',
    aggregationFn: 'sum',          // Built-in: 'sum', 'min', 'max', 'mean', 'median', 'count', 'unique', 'uniqueCount'
    aggregatedCell: ({ getValue }) => `Total: ${getValue()}`,
  },
];

// Grouping methods
column.toggleGrouping()           // Toggle grouping by column
column.getIsGrouped()             // Check if grouped
column.getGroupedIndex()          // Index in grouping array
table.setGrouping(grouping)       // Set grouping state
table.resetGrouping()             // Clear grouping

// Template - check if row is grouped
@for (row of table.getRowModel().rows; track row.id) {
  <sng-table-row>
    @if (row.getIsGrouped()) {
      <!-- Grouped row -->
      <sng-table-cell [attr.colspan]="row.getVisibleCells().length">
        <button (click)="row.toggleExpanded()">
          {{ row.getIsExpanded() ? 'v' : '>' }}
        </button>
        {{ row.groupingValue }} ({{ row.subRows.length }})
      </sng-table-cell>
    } @else {
      <!-- Regular row -->
      @for (cell of row.getVisibleCells(); track cell.id) {
        <sng-table-cell>{{ cell.getValue() }}</sng-table-cell>
      }
    }
  </sng-table-row>
}
```

## Faceting Feature

```typescript
import { createFacetingFeature } from 'sng-ui';

// Table configuration
table = createTable<TData>(() => ({
  data: this.data(),
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  _features: [createFacetingFeature(), createColumnFilteringFeature()],
}));

// Faceting methods - for building filter UIs
column.getFacetedUniqueValues()   // Map of unique values and their counts
column.getFacetedMinMaxValues()   // [min, max] for numeric columns
column.getFacetedRowModel()       // Filtered row model for this column

// Template - faceted dropdown filter
<select (change)="column.setFilterValue($event.target.value)">
  <option value="">All</option>
  @for (entry of column.getFacetedUniqueValues() | keyvalue; track entry.key) {
    <option [value]="entry.key">
      {{ entry.key }} ({{ entry.value }})
    </option>
  }
</select>

// Range filter for numeric columns
@let minMax = column.getFacetedMinMaxValues();
<input type="range"
  [min]="minMax?.[0]"
  [max]="minMax?.[1]"
  (input)="column.setFilterValue(['', $event.target.value])" />
```

## Virtual Scrolling

```typescript
import { CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf } from '@angular/cdk/scrolling';

// Use Angular CDK virtual scroll for large datasets
@Component({
  imports: [CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf],
  template: `
    <cdk-virtual-scroll-viewport [itemSize]="48" class="h-[400px]">
      <sng-table>
        <sng-table-body>
          <sng-table-row *cdkVirtualFor="let row of table.getRowModel().rows; trackBy: trackRow">
            @for (cell of row.getVisibleCells(); track cell.id) {
              <sng-table-cell>{{ cell.getValue() }}</sng-table-cell>
            }
          </sng-table-row>
        </sng-table-body>
      </sng-table>
    </cdk-virtual-scroll-viewport>
  `
})
export class VirtualTableComponent {
  trackRow = (index: number, row: Row<TData>) => row.id;
}
```

## UI Components Reference

```typescript
// Styled table components from sng-ui
import {
  SngTable,           // <sng-table> - wrapper with table styling
  SngTableHeader,     // <sng-table-header> - header section
  SngTableBody,       // <sng-table-body> - body section
  SngTableFooter,     // <sng-table-footer> - footer section
  SngTableRow,        // <sng-table-row> - table row
  SngTableHead,       // <sng-table-head> - header cell
  SngTableCell,       // <sng-table-cell> - body cell
  SngTableCaption,    // <sng-table-caption> - table caption
} from 'sng-ui';

// Usage
<sng-table>
  <sng-table-caption>A list of your recent invoices.</sng-table-caption>
  <sng-table-header>
    <sng-table-row>
      <sng-table-head>Invoice</sng-table-head>
      <sng-table-head>Status</sng-table-head>
      <sng-table-head class="text-right">Amount</sng-table-head>
    </sng-table-row>
  </sng-table-header>
  <sng-table-body>
    <sng-table-row>
      <sng-table-cell class="font-medium">INV001</sng-table-cell>
      <sng-table-cell>Paid</sng-table-cell>
      <sng-table-cell class="text-right">$250.00</sng-table-cell>
    </sng-table-row>
  </sng-table-body>
  <sng-table-footer>
    <sng-table-row>
      <sng-table-cell colspan="2">Total</sng-table-cell>
      <sng-table-cell class="text-right">$250.00</sng-table-cell>
    </sng-table-row>
  </sng-table-footer>
</sng-table>
```

## State Types Summary

```typescript
// All state types in one place
type SortingState = ColumnSort[];
type ColumnFiltersState = ColumnFilter[];
type GlobalFilterState = string;
type PaginationState = { pageIndex: number; pageSize: number };
type RowSelectionState = Record<string, boolean>;
type ColumnVisibilityState = Record<string, boolean>;
type ColumnOrderState = string[];
type ColumnSizingState = Record<string, number>;
type ColumnPinningState = { left?: string[]; right?: string[] };
type RowPinningState = { top: string[]; bottom: string[] };
type ExpandedState = true | Record<string, boolean>;
type GroupingState = string[];
```

## Do's and Don'ts

### Do
- Define columns once, outside of reactive context
- Use accessorKey for simple property access
- Use accessorFn for computed or nested values
- Add features only when needed
- Use TypeScript generics for type safety
- Provide getRowId for selection and pinning features
- Use row models in correct order (filter -> sort -> group -> expand -> paginate)

### Don't
- Don't wrap table methods in computed() - they're already memoized
- Don't mutate data directly - use signals and update methods
- Don't recreate columns on every render
- Don't forget to add row models for features that need them
- Don't use sorting without getSortedRowModel()
- Don't use filtering without getFilteredRowModel()

## Common Mistakes

1. **Forgetting getCoreRowModel** - Every table needs `getCoreRowModel: getCoreRowModel()` in options.

2. **Missing row model for feature** - Sorting needs `getSortedRowModel()`, filtering needs `getFilteredRowModel()`, etc.

3. **Mutating state directly** - Always use the provided update methods like `table.setSorting()`, not direct mutation.

4. **Columns in computed** - Columns should be static. Use `columnVisibility` state to show/hide columns dynamically.

5. **Wrong row model order** - Row models must be in pipeline order. Pagination must come after filtering/sorting.

6. **Missing getRowId** - Selection and pinning features need unique row IDs. Provide `getRowId: (row) => row.id`.

7. **Forgetting _features array** - Feature creators must be added to `_features: [createSortingFeature()]`.

## Accessibility Summary

- Use semantic HTML elements (`<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`)
- Add `scope="col"` to header cells: `<th scope="col">`
- Add `aria-sort="ascending|descending|none"` to sortable headers
- Selection checkboxes need `aria-label` for screen readers
- Pagination controls should be focus navigable with proper labels
- Use `role="grid"` for complex interactive tables with cell-level navigation
- Expandable rows should use `aria-expanded` attribute
- Group headers should announce the group name and count
