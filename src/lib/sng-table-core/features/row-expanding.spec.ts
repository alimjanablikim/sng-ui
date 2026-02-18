/**
 * @fileoverview Tests for row expanding feature
 */

import { signal } from '@angular/core';
import { createTable } from '../core/create-table';
import { getCoreRowModel } from '../row-models/core-row-model';
import { getExpandedRowModel } from '../row-models/expanded-row-model';
import { createRowExpandingFeature } from './row-expanding';
import { ColumnDef, ExpandedState } from '../core/types';

interface Category {
  id: string;
  name: string;
  count: number;
  subRows?: Category[];
}

const hierarchicalData: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    count: 150,
    subRows: [
      { id: '1-1', name: 'Phones', count: 50 },
      { id: '1-2', name: 'Laptops', count: 75 },
      { id: '1-3', name: 'Tablets', count: 25 },
    ],
  },
  {
    id: '2',
    name: 'Clothing',
    count: 200,
    subRows: [
      { id: '2-1', name: 'Men', count: 80 },
      { id: '2-2', name: 'Women', count: 100 },
    ],
  },
  {
    id: '3',
    name: 'Books',
    count: 300,
  },
];

const columns: ColumnDef<Category>[] = [
  { id: 'expander', header: '' },
  { accessorKey: 'name', header: 'Category' },
  { accessorKey: 'count', header: 'Items' },
];

describe('Row Expanding Feature', () => {
  describe('createRowExpandingFeature', () => {
    it('should create a feature object', () => {
      const feature = createRowExpandingFeature();
      expect(feature).toBeTruthy();
      expect(feature.createTable).toBeTruthy();
      expect(feature.createRow).toBeTruthy();
    });

    it('should have initial state getter', () => {
      const feature = createRowExpandingFeature();
      const initialState = feature.getInitialState?.({});
      expect(initialState?.expanded).toEqual({});
    });
  });

  describe('Table-level APIs', () => {
    let expanded: ReturnType<typeof signal<ExpandedState>>;
    let table: ReturnType<typeof createTable<Category>>;

    beforeEach(() => {
      expanded = signal<ExpandedState>({});
      table = createTable<Category>(() => ({
        data: hierarchicalData,
        columns,
        state: { expanded: expanded() },
        onExpandedChange: (updater) => {
          expanded.update((prev) =>
            typeof updater === 'function' ? updater(prev) : updater
          );
        },
        getSubRows: (row) => row.subRows,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        _features: [createRowExpandingFeature()],
      }));
    });

    it('should add setExpanded to table', () => {
      expect(table.setExpanded).toBeTruthy();
    });

    it('should add resetExpanded to table', () => {
      expect(table.resetExpanded).toBeTruthy();
    });

    it('should add toggleAllRowsExpanded to table', () => {
      expect(table.toggleAllRowsExpanded).toBeTruthy();
    });

    it('should add getIsAllRowsExpanded to table', () => {
      expect(table.getIsAllRowsExpanded).toBeTruthy();
    });

    it('should add getIsSomeRowsExpanded to table', () => {
      expect(table.getIsSomeRowsExpanded).toBeTruthy();
    });

    it('should setExpanded update state', () => {
      table.setExpanded?.({ '0': true });
      expect(expanded()).toEqual({ '0': true });
    });

    it('should setExpanded with updater function', () => {
      expanded.set({ '0': true });
      table.setExpanded?.((prev) => {
        const prevObj = typeof prev === 'object' ? prev : {};
        return { ...prevObj, '1': true };
      });
      expect(expanded()).toEqual({ '0': true, '1': true });
    });

    it('should toggleAllRowsExpanded expand all', () => {
      table.toggleAllRowsExpanded?.(true);
      expect(expanded()).toBe(true);
    });

    it('should toggleAllRowsExpanded collapse all', () => {
      expanded.set(true);
      table.toggleAllRowsExpanded?.(false);
      expect(expanded()).toEqual({});
    });

    it('should getIsAllRowsExpanded return true when all expanded', () => {
      expanded.set(true);
      expect(table.getIsAllRowsExpanded?.()).toBe(true);
    });

    it('should getIsAllRowsExpanded return false when not all expanded', () => {
      expanded.set({ '0': true });
      expect(table.getIsAllRowsExpanded?.()).toBe(false);
    });

    it('should getIsSomeRowsExpanded return true when some expanded', () => {
      expanded.set({ '0': true });
      expect(table.getIsSomeRowsExpanded?.()).toBe(true);
    });

    it('should getIsSomeRowsExpanded return false when none expanded', () => {
      expanded.set({});
      expect(table.getIsSomeRowsExpanded?.()).toBe(false);
    });
  });

  describe('Row-level APIs', () => {
    let expanded: ReturnType<typeof signal<ExpandedState>>;
    let table: ReturnType<typeof createTable<Category>>;

    beforeEach(() => {
      expanded = signal<ExpandedState>({});
      table = createTable<Category>(() => ({
        data: hierarchicalData,
        columns,
        state: { expanded: expanded() },
        onExpandedChange: (updater) => {
          expanded.update((prev) =>
            typeof updater === 'function' ? updater(prev) : updater
          );
        },
        getSubRows: (row) => row.subRows,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        _features: [createRowExpandingFeature()],
      }));
    });

    it('should add getCanExpand to row', () => {
      const row = table.getRow('0');
      expect(row.getCanExpand).toBeTruthy();
    });

    it('should add getIsExpanded to row', () => {
      const row = table.getRow('0');
      expect(row.getIsExpanded).toBeTruthy();
    });

    it('should add toggleExpanded to row', () => {
      const row = table.getRow('0');
      expect(row.toggleExpanded).toBeTruthy();
    });

    it('should getCanExpand return true for rows with subRows', () => {
      const electronicsRow = table.getRow('0'); // Electronics has subRows
      expect(electronicsRow.getCanExpand?.()).toBe(true);
    });

    it('should getCanExpand return false for rows without subRows', () => {
      const booksRow = table.getRow('2'); // Books has no subRows
      expect(booksRow.getCanExpand?.()).toBe(false);
    });

    it('should getIsExpanded return false initially', () => {
      const row = table.getRow('0');
      expect(row.getIsExpanded?.()).toBe(false);
    });

    it('should getIsExpanded return true when expanded', () => {
      expanded.set({ '0': true });
      const row = table.getRow('0');
      expect(row.getIsExpanded?.()).toBe(true);
    });

    it('should toggleExpanded expand a row', () => {
      const row = table.getRow('0');
      row.toggleExpanded?.();
      expect(expanded()).toEqual({ '0': true });
    });

    it('should toggleExpanded collapse an expanded row', () => {
      expanded.set({ '0': true });
      const row = table.getRow('0');
      row.toggleExpanded?.();
      expect(expanded()).toEqual({});
    });

    it('should toggleExpanded with explicit value', () => {
      const row = table.getRow('0');
      row.toggleExpanded?.(true);
      expect(expanded()).toEqual({ '0': true });

      row.toggleExpanded?.(false);
      expect(expanded()).toEqual({});
    });

    it('should not toggle non-expandable rows', () => {
      const booksRow = table.getRow('2'); // Books has no subRows
      booksRow.toggleExpanded?.();
      expect(expanded()).toEqual({});
    });
  });

  describe('Expanded row model', () => {
    let expanded: ReturnType<typeof signal<ExpandedState>>;
    let table: ReturnType<typeof createTable<Category>>;

    beforeEach(() => {
      expanded = signal<ExpandedState>({});
      table = createTable<Category>(() => ({
        data: hierarchicalData,
        columns,
        state: { expanded: expanded() },
        onExpandedChange: (updater) => {
          expanded.update((prev) =>
            typeof updater === 'function' ? updater(prev) : updater
          );
        },
        getSubRows: (row) => row.subRows,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        _features: [createRowExpandingFeature()],
      }));
    });

    it('should return only top-level rows when nothing is expanded', () => {
      const rowModel = table.getRowModel();
      expect(rowModel.rows.length).toBe(3);
      expect(rowModel.rows[0].original.name).toBe('Electronics');
      expect(rowModel.rows[1].original.name).toBe('Clothing');
      expect(rowModel.rows[2].original.name).toBe('Books');
    });

    it('should include sub-rows when parent is expanded', () => {
      expanded.set({ '0': true }); // Expand Electronics

      const rowModel = table.getRowModel();

      // Should have Electronics + its 3 sub-rows + Clothing + Books = 6 rows
      expect(rowModel.rows.length).toBe(6);

      // Verify order
      expect(rowModel.rows[0].original.name).toBe('Electronics');
      expect(rowModel.rows[1].original.name).toBe('Phones');
      expect(rowModel.rows[2].original.name).toBe('Laptops');
      expect(rowModel.rows[3].original.name).toBe('Tablets');
      expect(rowModel.rows[4].original.name).toBe('Clothing');
      expect(rowModel.rows[5].original.name).toBe('Books');
    });

    it('should include all sub-rows when expanded is true', () => {
      expanded.set(true); // Expand all

      const rowModel = table.getRowModel();

      // Should have all rows: 2 parents with 5 children + 1 leaf = 8 rows total
      expect(rowModel.rows.length).toBe(8);
    });

    it('should update when expanded state changes', () => {
      // Initially collapsed
      expect(table.getRowModel().rows.length).toBe(3);

      // Expand first row
      expanded.set({ '0': true });
      expect(table.getRowModel().rows.length).toBe(6);

      // Expand second row too
      expanded.set({ '0': true, '1': true });
      expect(table.getRowModel().rows.length).toBe(8);

      // Collapse all
      expanded.set({});
      expect(table.getRowModel().rows.length).toBe(3);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty data', () => {
      const expanded = signal<ExpandedState>({});
      const table = createTable<Category>(() => ({
        data: [],
        columns,
        state: { expanded: expanded() },
        getSubRows: (row) => row.subRows,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        _features: [createRowExpandingFeature()],
      }));

      expect(table.getRowModel().rows.length).toBe(0);
    });

    it('should handle flat data (no subRows)', () => {
      const flatData: Category[] = [
        { id: '1', name: 'A', count: 1 },
        { id: '2', name: 'B', count: 2 },
      ];

      const expanded = signal<ExpandedState>({});
      const table = createTable<Category>(() => ({
        data: flatData,
        columns,
        state: { expanded: expanded() },
        getSubRows: (row) => row.subRows,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        _features: [createRowExpandingFeature()],
      }));

      // All rows should be non-expandable
      const rows = table.getCoreRowModel().rows;
      expect(rows[0].getCanExpand?.()).toBe(false);
      expect(rows[1].getCanExpand?.()).toBe(false);

      // Row model should be unchanged
      expect(table.getRowModel().rows.length).toBe(2);
    });

    it('should handle deeply nested data', () => {
      const deepData: Category[] = [
        {
          id: '1',
          name: 'Level 1',
          count: 100,
          subRows: [
            {
              id: '1-1',
              name: 'Level 2',
              count: 50,
              subRows: [{ id: '1-1-1', name: 'Level 3', count: 25 }],
            },
          ],
        },
      ];

      const expanded = signal<ExpandedState>(true); // Expand all
      const table = createTable<Category>(() => ({
        data: deepData,
        columns,
        state: { expanded: expanded() },
        getSubRows: (row) => row.subRows,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        _features: [createRowExpandingFeature()],
      }));

      const rowModel = table.getRowModel();
      expect(rowModel.rows.length).toBe(3);
      expect(rowModel.rows[0].depth).toBe(0);
      expect(rowModel.rows[1].depth).toBe(1);
      expect(rowModel.rows[2].depth).toBe(2);
    });
  });
});
