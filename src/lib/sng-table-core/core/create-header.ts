/**
 * @fileoverview Header creation and management for sng-table-core
 */

import {
  Header,
  HeaderContext,
  HeaderGroup,
  Column,
  Table,
  ColumnPinningPosition,
} from './types';

// ============================================================================
// HEADER CREATION
// ============================================================================

/**
 * Create a header instance for a column
 */
export function createHeader<TData, TValue = unknown>(
  table: Table<TData>,
  column: Column<TData, TValue>,
  options: {
    id?: string;
    isPlaceholder?: boolean;
    depth: number;
    index: number;
  }
): Header<TData, TValue> {
  const id = options.id ?? `${column.id}_${options.depth}`;

  // Create the header instance
  const header: Header<TData, TValue> = {
    id,
    column,
    depth: options.depth,
    index: options.index,
    isPlaceholder: options.isPlaceholder ?? false,
    colSpan: 1, // Will be calculated
    rowSpan: 1, // Will be calculated
    subHeaders: [], // Will be populated for group columns

    getContext: () => getHeaderContext(table, column, header),

    getLeafHeaders: () => getLeafHeaders(header),
  };

  return header;
}

// ============================================================================
// HEADER CONTEXT
// ============================================================================

/**
 * Create the header context for rendering
 */
function getHeaderContext<TData, TValue>(
  table: Table<TData>,
  column: Column<TData, TValue>,
  header: Header<TData, TValue>
): HeaderContext<TData, TValue> {
  return {
    table,
    column,
    header,
  };
}

// ============================================================================
// HEADER TRAVERSAL
// ============================================================================

/**
 * Get all leaf headers from a header's subtree
 */
function getLeafHeaders<TData>(
  header: Header<TData, unknown>
): Header<TData, unknown>[] {
  if (!header.subHeaders.length) {
    return [header];
  }

  return header.subHeaders.flatMap((subHeader) => getLeafHeaders(subHeader));
}

// ============================================================================
// HEADER GROUPS
// ============================================================================

/**
 * Build header groups from columns
 *
 * Header groups represent rows of headers in the table head.
 * For nested columns, this creates multiple rows with appropriate colSpan/rowSpan.
 */
export function buildHeaderGroups<TData>(
  table: Table<TData>,
  columns: Column<TData, unknown>[],
  _position?: ColumnPinningPosition
): HeaderGroup<TData>[] {
  // Find the maximum depth of nested columns
  const maxDepth = getMaxColumnDepth(columns);

  // Build header groups from bottom to top
  const headerGroups: HeaderGroup<TData>[] = [];

  // Build each depth level
  for (let depth = 0; depth <= maxDepth; depth++) {
    const headers: Header<TData, unknown>[] = [];

    // Get columns that should appear at this depth
    const columnsAtDepth = getColumnsForDepth(columns, depth, maxDepth);

    columnsAtDepth.forEach((col, index) => {
      const isLeaf = !col.columns.length;
      const actualDepth = col.depth;

      // Create header for this column
      const header = createHeader(table, col, {
        depth,
        index,
        isPlaceholder: depth < actualDepth, // Placeholder if we're above the column's actual depth
      });

      // Calculate spans
      if (isLeaf) {
        // Leaf columns span all remaining rows
        header.rowSpan = maxDepth - actualDepth + 1;
        header.colSpan = 1;
      } else {
        // Group columns span their children
        header.rowSpan = 1;
        header.colSpan = col.getLeafColumns().length;
      }

      // Build sub-headers for group columns
      if (col.columns.length) {
        header.subHeaders = col.columns.map((childCol, childIndex) =>
          createHeader(table, childCol, {
            depth: depth + 1,
            index: childIndex,
            isPlaceholder: false,
          })
        );
      }

      headers.push(header);
    });

    headerGroups.push({
      id: `header_group_${depth}`,
      depth,
      headers,
    });
  }

  return headerGroups;
}

/**
 * Get the maximum depth of nested columns
 */
function getMaxColumnDepth<TData>(columns: Column<TData, unknown>[]): number {
  let maxDepth = 0;

  function traverse(cols: Column<TData, unknown>[], currentDepth: number) {
    for (const col of cols) {
      maxDepth = Math.max(maxDepth, currentDepth);
      if (col.columns.length) {
        traverse(col.columns, currentDepth + 1);
      }
    }
  }

  traverse(columns, 0);
  return maxDepth;
}

/**
 * Group columns by their depth
 * @internal Reserved for future use
 */
function _groupColumnsByDepth<TData>(
  columns: Column<TData, unknown>[]
): Map<number, Column<TData, unknown>[]> {
  const result = new Map<number, Column<TData, unknown>[]>();

  function traverse(cols: Column<TData, unknown>[]) {
    for (const col of cols) {
      const depth = col.depth;
      if (!result.has(depth)) {
        result.set(depth, []);
      }
      result.get(depth)!.push(col);

      if (col.columns.length) {
        traverse(col.columns);
      }
    }
  }

  traverse(columns);
  return result;
}

/**
 * Get columns that should appear at a specific depth level
 * Includes placeholders for columns that appear at deeper levels
 */
function getColumnsForDepth<TData>(
  columns: Column<TData, unknown>[],
  targetDepth: number,
  _maxDepth: number
): Column<TData, unknown>[] {
  const result: Column<TData, unknown>[] = [];

  function traverse(cols: Column<TData, unknown>[], currentDepth: number) {
    for (const col of cols) {
      if (currentDepth === targetDepth) {
        // This column should appear at this depth
        result.push(col);
      } else if (currentDepth < targetDepth && col.columns.length) {
        // Recurse into children
        traverse(col.columns, currentDepth + 1);
      } else if (currentDepth < targetDepth && !col.columns.length) {
        // Leaf column that starts earlier - need placeholder at this depth
        // But we only show it once at its actual depth with rowSpan
        // So skip here
      }
    }
  }

  traverse(columns, 0);
  return result;
}

/**
 * Build flattened header list from header groups
 */
export function getFlatHeaders<TData>(
  headerGroups: HeaderGroup<TData>[]
): Header<TData, unknown>[] {
  return headerGroups.flatMap((group) => group.headers);
}

/**
 * Get leaf headers (headers without sub-headers)
 */
export function getLeafHeadersFromGroups<TData>(
  headerGroups: HeaderGroup<TData>[]
): Header<TData, unknown>[] {
  const lastGroup = headerGroups[headerGroups.length - 1];
  return lastGroup?.headers ?? [];
}

/**
 * Build footer groups (same structure as header groups, just from bottom of table)
 */
export function buildFooterGroups<TData>(
  table: Table<TData>,
  columns: Column<TData, unknown>[]
): HeaderGroup<TData>[] {
  // Footers are built the same way as headers
  // The difference is in how they're rendered (at bottom of table)
  return buildHeaderGroups(table, columns).map((group) => ({
    ...group,
    id: `footer_group_${group.depth}`,
  }));
}
