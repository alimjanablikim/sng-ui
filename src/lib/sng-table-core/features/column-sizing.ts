/**
 * @fileoverview Column sizing feature for sng-table-core
 *
 * Provides column resizing functionality.
 */

import {
  ColumnSizingState,
  ColumnSizingInfoState,
  Updater,
  functionalUpdate,
  TableFeature,
  ColumnPinningPosition,
} from '../core/types';

// ============================================================================
// DEFAULT VALUES
// ============================================================================

const DEFAULT_COLUMN_SIZE = 150;
const DEFAULT_COLUMN_MIN_SIZE = 20;
const DEFAULT_COLUMN_MAX_SIZE = Number.MAX_SAFE_INTEGER;

// ============================================================================
// COLUMN SIZING FEATURE
// ============================================================================

/**
 * Create the column sizing feature
 */
export function createColumnSizingFeature<TData>(): TableFeature<TData> {
  return {
    getInitialState: (initialState) => ({
      columnSizing: initialState?.columnSizing ?? {},
      columnSizingInfo: initialState?.columnSizingInfo ?? {
        startOffset: null,
        startSize: null,
        deltaOffset: null,
        deltaPercentage: null,
        columnSizingStart: [],
        isResizingColumn: false,
      },
    }),

    getDefaultOptions: (_table) => ({
      enableColumnResizing: true,
      columnResizeMode: 'onEnd' as const,
      columnResizeDirection: 'ltr' as const,
    }),

    createTable: (table) => {
      table.setColumnSizing = (updater: Updater<ColumnSizingState>) => {
        table.setState((prev) => ({
          ...prev,
          columnSizing: functionalUpdate(updater, prev.columnSizing),
        }));
        table.options.onColumnSizingChange?.(updater);
      };

      table.setColumnSizingInfo = (updater: Updater<ColumnSizingInfoState>) => {
        table.setState((prev) => ({
          ...prev,
          columnSizingInfo: functionalUpdate(updater, prev.columnSizingInfo),
        }));
        table.options.onColumnSizingInfoChange?.(updater);
      };

      table.resetColumnSizing = (defaultState?: boolean) => {
        table.setColumnSizing?.(
          defaultState ? {} : (table.initialState.columnSizing ?? {})
        );
      };

      table.getTotalSize = () => {
        return table.getAllLeafColumns().reduce(
          (sum, column) => sum + (column.getSize?.() ?? DEFAULT_COLUMN_SIZE),
          0
        );
      };

      table.getLeftTotalSize = () => {
        const leftColumns = table.getLeftVisibleLeafColumns?.() ?? [];
        return leftColumns.reduce(
          (sum, column) => sum + (column.getSize?.() ?? DEFAULT_COLUMN_SIZE),
          0
        );
      };

      table.getCenterTotalSize = () => {
        const centerColumns = table.getCenterVisibleLeafColumns?.() ?? table.getVisibleLeafColumns?.() ?? [];
        return centerColumns.reduce(
          (sum, column) => sum + (column.getSize?.() ?? DEFAULT_COLUMN_SIZE),
          0
        );
      };

      table.getRightTotalSize = () => {
        const rightColumns = table.getRightVisibleLeafColumns?.() ?? [];
        return rightColumns.reduce(
          (sum, column) => sum + (column.getSize?.() ?? DEFAULT_COLUMN_SIZE),
          0
        );
      };
    },

    createColumn: (column, table) => {
      column.getCanResize = () => {
        const { enableColumnResizing } = table.options;
        const { enableResizing } = column.columnDef;

        if (enableResizing === false) return false;
        if (enableColumnResizing === false) return false;

        return true;
      };

      column.getIsResizing = () => {
        const { columnSizingInfo } = table.getState();
        return columnSizingInfo.isResizingColumn === column.id;
      };

      column.getSize = () => {
        const { columnSizing } = table.getState();
        const { size, minSize, maxSize } = column.columnDef;

        const configSize = size ?? DEFAULT_COLUMN_SIZE;
        const stateSize = columnSizing[column.id];

        const currentSize = stateSize ?? configSize;
        const min = minSize ?? DEFAULT_COLUMN_MIN_SIZE;
        const max = maxSize ?? DEFAULT_COLUMN_MAX_SIZE;

        return Math.min(Math.max(currentSize, min), max);
      };

      column.getStart = (position?: ColumnPinningPosition) => {
        const columns = position === 'left'
          ? table.getLeftVisibleLeafColumns?.() ?? []
          : position === 'right'
            ? table.getRightVisibleLeafColumns?.() ?? []
            : table.getVisibleLeafColumns?.() ?? [];

        const index = columns.findIndex((c) => c.id === column.id);
        if (index === -1) return 0;

        return columns
          .slice(0, index)
          .reduce((sum, col) => sum + (col.getSize?.() ?? DEFAULT_COLUMN_SIZE), 0);
      };

      column.resetSize = () => {
        table.setColumnSizing?.((prev) => {
          const { [column.id]: _, ...rest } = prev;
          return rest;
        });
      };
    },

    createHeader: (header, table) => {
      header.getSize = () => {
        let sum = 0;
        const leafHeaders = header.getLeafHeaders();

        for (const leafHeader of leafHeaders) {
          sum += leafHeader.column.getSize?.() ?? DEFAULT_COLUMN_SIZE;
        }

        return sum;
      };

      header.getStart = (position?: ColumnPinningPosition) => {
        if (header.isPlaceholder) return 0;
        return header.column.getStart?.(position) ?? 0;
      };

      header.getResizeHandler = () => {
        if (!header.column.getCanResize?.()) {
          return () => { /* no-op - column cannot be resized */ };
        }

        return (event: unknown) => {
          // This is a simplified version - full implementation would handle
          // mouse/touch events for drag resizing
          const mouseEvent = event as MouseEvent;

          const startX = mouseEvent.clientX;
          const startSize = header.column.getSize?.() ?? DEFAULT_COLUMN_SIZE;

          // Start resizing
          table.setColumnSizingInfo?.({
            startOffset: startX,
            startSize,
            deltaOffset: 0,
            deltaPercentage: 0,
            columnSizingStart: [[header.column.id, startSize]],
            isResizingColumn: header.column.id,
          });

          const doc = globalThis.document;
          if (!doc) {
            return;
          }

          const onMove = (e: MouseEvent) => {
            const deltaX = e.clientX - startX;
            const { columnResizeDirection } = table.options;
            const delta = columnResizeDirection === 'rtl' ? -deltaX : deltaX;

            const newSize = Math.max(
              header.column.columnDef.minSize ?? DEFAULT_COLUMN_MIN_SIZE,
              Math.min(
                header.column.columnDef.maxSize ?? DEFAULT_COLUMN_MAX_SIZE,
                startSize + delta
              )
            );

            if (table.options.columnResizeMode === 'onChange') {
              table.setColumnSizing?.((prev) => ({
                ...prev,
                [header.column.id]: newSize,
              }));
            }

            table.setColumnSizingInfo?.((prev) => ({
              ...prev,
              deltaOffset: delta,
              deltaPercentage: delta / startSize,
            }));
          };

          const onEnd = () => {
            const { deltaOffset } = table.getState().columnSizingInfo;

            if (table.options.columnResizeMode === 'onEnd' && deltaOffset) {
              const newSize = Math.max(
                header.column.columnDef.minSize ?? DEFAULT_COLUMN_MIN_SIZE,
                Math.min(
                  header.column.columnDef.maxSize ?? DEFAULT_COLUMN_MAX_SIZE,
                  startSize + deltaOffset
                )
              );

              table.setColumnSizing?.((prev) => ({
                ...prev,
                [header.column.id]: newSize,
              }));
            }

            table.setColumnSizingInfo?.({
              startOffset: null,
              startSize: null,
              deltaOffset: null,
              deltaPercentage: null,
              columnSizingStart: [],
              isResizingColumn: false,
            });

            doc.removeEventListener('mousemove', onMove);
            doc.removeEventListener('mouseup', onEnd);
          };

          doc.addEventListener('mousemove', onMove);
          doc.addEventListener('mouseup', onEnd);
        };
      };
    },
  };
}
