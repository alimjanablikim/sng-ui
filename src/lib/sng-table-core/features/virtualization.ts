/**
 * @fileoverview Virtualization utilities for sng-table-core
 *
 * Provides helpers for integrating with Angular CDK's virtual scroll.
 * This follows the headless philosophy - we provide the data/calculations,
 * CDK handles the actual virtual scrolling.
 *
 * @example
 * ```typescript
 * // In your component template:
 * <cdk-virtual-scroll-viewport [itemSize]="rowHeight" class="h-[400px]">
 *   <tr *cdkVirtualFor="let row of table.getRowModel().rows; trackBy: trackRowById">
 *     <!-- row content -->
 *   </tr>
 * </cdk-virtual-scroll-viewport>
 * ```
 */

import { Table, Row, TableFeature } from '../core/types';

// ============================================================================
// VIRTUALIZATION TYPES
// ============================================================================

/**
 * Virtual row range - which rows are currently visible
 */
export interface VirtualRange {
  /** Index of first visible row */
  startIndex: number;
  /** Index of last visible row */
  endIndex: number;
  /** Number of rows before visible area (for scroll position) */
  overscanStartCount: number;
  /** Number of rows after visible area (for smooth scrolling) */
  overscanEndCount: number;
}

/**
 * Virtual row measurement
 */
export interface VirtualRowMeasurement {
  /** Row index */
  index: number;
  /** Start position (top) in pixels */
  start: number;
  /** End position (bottom) in pixels */
  end: number;
  /** Row height in pixels */
  size: number;
}

/**
 * Options for virtual scrolling
 */
export interface VirtualizationOptions {
  /** Estimated row height in pixels (for initial render) */
  estimatedRowHeight: number;
  /** Number of rows to render outside visible area */
  overscan?: number;
  /** Whether rows have variable heights */
  variableRowHeights?: boolean;
}

// ============================================================================
// VIRTUALIZATION FEATURE
// ============================================================================

/**
 * Create the virtualization feature
 *
 * This feature provides utilities for virtual scrolling integration.
 * Use with Angular CDK's CdkVirtualScrollViewport for best results.
 */
export function createVirtualizationFeature<TData>(): TableFeature<TData> {
  return {
    getDefaultOptions: () => ({
      virtualScrollEstimatedRowHeight: 48,
      virtualScrollOverscan: 5,
    }),

    createTable: (table) => {
      /**
       * Get virtual rows for rendering
       *
       * This is a helper for CDK virtual scroll integration.
       * Returns the rows from the current row model.
       */
      table.getVirtualRows = () => {
        return table.getRowModel().flatRows;
      };

      /**
       * Get total row count for virtual scrolling
       */
      table.getVirtualRowCount = () => {
        return table.getRowModel().flatRows.length;
      };
    },
  };
}

// ============================================================================
// VIRTUALIZATION UTILITIES
// ============================================================================

/**
 * Calculate which rows should be rendered based on scroll position
 *
 * @param totalRows - Total number of rows
 * @param scrollTop - Current scroll position
 * @param viewportHeight - Height of visible area
 * @param rowHeight - Estimated row height
 * @param overscan - Number of rows to render outside visible area
 */
export function calculateVirtualRange(
  totalRows: number,
  scrollTop: number,
  viewportHeight: number,
  rowHeight: number,
  overscan = 5
): VirtualRange {
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const visibleCount = Math.ceil(viewportHeight / rowHeight);
  const endIndex = Math.min(
    totalRows - 1,
    Math.floor(scrollTop / rowHeight) + visibleCount + overscan
  );

  return {
    startIndex,
    endIndex,
    overscanStartCount: Math.min(overscan, Math.floor(scrollTop / rowHeight)),
    overscanEndCount: Math.min(overscan, totalRows - endIndex - 1),
  };
}

/**
 * Calculate total scroll height for virtual scrolling
 *
 * @param totalRows - Total number of rows
 * @param rowHeight - Estimated row height
 */
export function calculateTotalHeight(
  totalRows: number,
  rowHeight: number
): number {
  return totalRows * rowHeight;
}

/**
 * Calculate the offset (padding-top) for virtual rows
 *
 * @param startIndex - Index of first rendered row
 * @param rowHeight - Estimated row height
 */
export function calculateScrollOffset(
  startIndex: number,
  rowHeight: number
): number {
  return startIndex * rowHeight;
}

/**
 * Create a trackBy function for virtual rows
 *
 * Use this with *cdkVirtualFor or @for to help Angular track rows efficiently.
 *
 * @example
 * ```html
 * <tr *cdkVirtualFor="let row of rows; trackBy: trackRowById">
 * ```
 */
export function createRowTrackByFn<TData>(): (index: number, row: Row<TData>) => string {
  return (_index: number, row: Row<TData>) => row.id;
}

/**
 * Create a trackBy function that uses row index
 *
 * Use this when rows don't have stable IDs.
 */
export function createIndexTrackByFn<TData>(): (index: number, _row: Row<TData>) => number {
  return (index: number) => index;
}

/**
 * Get visible rows within a range
 *
 * @param table - The table instance
 * @param startIndex - Start index (inclusive)
 * @param endIndex - End index (inclusive)
 */
export function getRowsInRange<TData>(
  table: Table<TData>,
  startIndex: number,
  endIndex: number
): Row<TData>[] {
  const rows = table.getRowModel().flatRows;
  return rows.slice(startIndex, endIndex + 1);
}

/**
 * Calculate row measurements for variable height rows
 *
 * This is useful when rows have different heights and you need
 * to calculate their positions for proper scrolling.
 *
 * @param rows - Array of rows
 * @param measureFn - Function to measure row height
 */
export function measureRows<TData>(
  rows: Row<TData>[],
  measureFn: (row: Row<TData>) => number
): VirtualRowMeasurement[] {
  const measurements: VirtualRowMeasurement[] = [];
  let currentPosition = 0;

  for (let i = 0; i < rows.length; i++) {
    const size = measureFn(rows[i]);
    measurements.push({
      index: i,
      start: currentPosition,
      end: currentPosition + size,
      size,
    });
    currentPosition += size;
  }

  return measurements;
}

/**
 * Find the row index at a given scroll position (for variable height rows)
 *
 * @param measurements - Pre-computed row measurements
 * @param scrollTop - Current scroll position
 */
export function findRowIndexAtPosition(
  measurements: VirtualRowMeasurement[],
  scrollTop: number
): number {
  // Binary search for efficiency
  let low = 0;
  let high = measurements.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const measurement = measurements[mid];

    if (scrollTop >= measurement.start && scrollTop < measurement.end) {
      return mid;
    } else if (scrollTop < measurement.start) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return Math.min(low, measurements.length - 1);
}

// ============================================================================
// CDK INTEGRATION HELPERS
// ============================================================================

/**
 * Create a data source for CDK virtual scroll
 *
 * This returns the rows array that can be used directly with
 * CdkVirtualScrollViewport's *cdkVirtualFor directive.
 *
 * @example
 * ```typescript
 * // In your component
 * rows = createVirtualDataSource(table);
 *
 * // In template
 * <cdk-virtual-scroll-viewport [itemSize]="48">
 *   <tr *cdkVirtualFor="let row of rows()">...</tr>
 * </cdk-virtual-scroll-viewport>
 * ```
 */
export function createVirtualDataSource<TData>(
  table: Table<TData>
): () => Row<TData>[] {
  return () => table.getRowModel().flatRows;
}

/**
 * Get the item size (row height) for CDK virtual scroll
 *
 * This returns the estimated row height from table options.
 */
export function getVirtualRowHeight<TData>(table: Table<TData>): number {
  return (table.options as { virtualScrollEstimatedRowHeight?: number })
    .virtualScrollEstimatedRowHeight ?? 48;
}
