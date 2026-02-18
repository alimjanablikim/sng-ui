/**
 * @fileoverview Tests for createTable factory function
 */

import { signal } from '@angular/core';
import { createTable } from './create-table';
import { getCoreRowModel } from '../row-models/core-row-model';
import { ColumnDef, ExpandedState } from './types';

interface Person {
  id: string;
  name: string;
  age: number;
}

interface Category {
  id: string;
  name: string;
  count: number;
  subRows?: Category[];
}

const sampleData: Person[] = [
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
  { id: '3', name: 'Charlie', age: 35 },
];

const sampleColumns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
];

const hierarchicalData: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    count: 150,
    subRows: [
      { id: '1-1', name: 'Phones', count: 50 },
      { id: '1-2', name: 'Laptops', count: 75 },
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
];

const categoryColumns: ColumnDef<Category>[] = [
  { accessorKey: 'name', header: 'Category' },
  { accessorKey: 'count', header: 'Items' },
];

describe('createTable', () => {
  describe('Table creation', () => {
    it('should create a table instance', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns: sampleColumns,
        getCoreRowModel: getCoreRowModel(),
      }));

      expect(table).toBeTruthy();
      expect(table.options).toBeTruthy();
      expect(table.getState).toBeTruthy();
      expect(table.setState).toBeTruthy();
    });

    it('should have initial state', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns: sampleColumns,
        getCoreRowModel: getCoreRowModel(),
      }));

      const state = table.getState();
      expect(state.sorting).toEqual([]);
      expect(state.columnFilters).toEqual([]);
      expect(state.pagination).toEqual({ pageIndex: 0, pageSize: 10 });
      expect(state.rowSelection).toEqual({});
      expect(state.expanded).toEqual({});
    });

    it('should accept initial state', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns: sampleColumns,
        getCoreRowModel: getCoreRowModel(),
        initialState: {
          pagination: { pageIndex: 2, pageSize: 20 },
          sorting: [{ id: 'name', desc: false }],
        },
      }));

      const state = table.getState();
      expect(state.pagination).toEqual({ pageIndex: 2, pageSize: 20 });
      expect(state.sorting).toEqual([{ id: 'name', desc: false }]);
    });
  });

  describe('Columns', () => {
    it('should build columns', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns: sampleColumns,
        getCoreRowModel: getCoreRowModel(),
      }));

      const columns = table.getAllColumns();
      expect(columns.length).toBe(2);
      expect(columns[0].id).toBe('name');
      expect(columns[1].id).toBe('age');
    });

    it('should get column by id', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns: sampleColumns,
        getCoreRowModel: getCoreRowModel(),
      }));

      const nameColumn = table.getColumn('name');
      expect(nameColumn).toBeTruthy();
      expect(nameColumn?.id).toBe('name');

      const unknownColumn = table.getColumn('unknown');
      expect(unknownColumn).toBeUndefined();
    });

    it('should get flat columns', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns: sampleColumns,
        getCoreRowModel: getCoreRowModel(),
      }));

      const flatColumns = table.getAllFlatColumns();
      expect(flatColumns.length).toBe(2);
    });

    it('should get leaf columns', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns: sampleColumns,
        getCoreRowModel: getCoreRowModel(),
      }));

      const leafColumns = table.getAllLeafColumns();
      expect(leafColumns.length).toBe(2);
    });
  });

  describe('Headers', () => {
    it('should build header groups', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns: sampleColumns,
        getCoreRowModel: getCoreRowModel(),
      }));

      const headerGroups = table.getHeaderGroups();
      expect(headerGroups.length).toBe(1);
      expect(headerGroups[0].headers.length).toBe(2);
    });

    it('should get flat headers', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns: sampleColumns,
        getCoreRowModel: getCoreRowModel(),
      }));

      const flatHeaders = table.getFlatHeaders();
      expect(flatHeaders.length).toBe(2);
    });

    it('should get leaf headers', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns: sampleColumns,
        getCoreRowModel: getCoreRowModel(),
      }));

      const leafHeaders = table.getLeafHeaders();
      expect(leafHeaders.length).toBe(2);
    });
  });

  describe('Row model', () => {
    it('should get core row model', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns: sampleColumns,
        getCoreRowModel: getCoreRowModel(),
      }));

      const rowModel = table.getCoreRowModel();
      expect(rowModel.rows.length).toBe(3);
      expect(rowModel.flatRows.length).toBe(3);
    });

    it('should get row model', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns: sampleColumns,
        getCoreRowModel: getCoreRowModel(),
      }));

      const rowModel = table.getRowModel();
      expect(rowModel.rows.length).toBe(3);
    });

    it('should get row by id', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns: sampleColumns,
        getCoreRowModel: getCoreRowModel(),
      }));

      const row = table.getRow('0');
      expect(row).toBeTruthy();
      expect(row.original.name).toBe('Alice');
    });

    it('should throw for unknown row id', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns: sampleColumns,
        getCoreRowModel: getCoreRowModel(),
      }));

      expect(() => table.getRow('unknown')).toThrowError();
    });
  });

  describe('State management', () => {
    it('should update state', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns: sampleColumns,
        getCoreRowModel: getCoreRowModel(),
      }));

      table.setState((prev) => ({
        ...prev,
        sorting: [{ id: 'name', desc: true }],
      }));

      expect(table.getState().sorting).toEqual([{ id: 'name', desc: true }]);
    });

    it('should reset state', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns: sampleColumns,
        getCoreRowModel: getCoreRowModel(),
        initialState: {
          sorting: [{ id: 'age', desc: false }],
        },
      }));

      // Change state
      table.setState((prev) => ({
        ...prev,
        sorting: [{ id: 'name', desc: true }],
      }));
      expect(table.getState().sorting).toEqual([{ id: 'name', desc: true }]);

      // Reset
      table.reset();
      expect(table.getState().sorting).toEqual([{ id: 'age', desc: false }]);
    });

    it('should call onStateChange callback', () => {
      const onStateChange = jasmine.createSpy('onStateChange');

      const table = createTable<Person>(() => ({
        data: sampleData,
        columns: sampleColumns,
        getCoreRowModel: getCoreRowModel(),
        onStateChange,
      }));

      table.setState((prev) => ({
        ...prev,
        sorting: [{ id: 'name', desc: true }],
      }));

      expect(onStateChange).toHaveBeenCalled();
    });
  });

  describe('Controlled state', () => {
    it('should use controlled state from options', () => {
      const sorting = signal([{ id: 'name', desc: false }]);

      const table = createTable<Person>(() => ({
        data: sampleData,
        columns: sampleColumns,
        getCoreRowModel: getCoreRowModel(),
        state: { sorting: sorting() },
      }));

      expect(table.getState().sorting).toEqual([{ id: 'name', desc: false }]);
    });

    it('should pick up signal changes on getState', () => {
      const expanded = signal<ExpandedState>({});

      const table = createTable<Person>(() => ({
        data: sampleData,
        columns: sampleColumns,
        getCoreRowModel: getCoreRowModel(),
        state: { expanded: expanded() },
      }));

      // Initial state
      expect(table.getState().expanded).toEqual({});

      // Update signal
      expanded.set({ '0': true });

      // getState should pick up the change
      expect(table.getState().expanded).toEqual({ '0': true });
    });
  });

  describe('Hierarchical data', () => {
    it('should build rows with sub-rows', () => {
      const table = createTable<Category>(() => ({
        data: hierarchicalData,
        columns: categoryColumns,
        getCoreRowModel: getCoreRowModel(),
        getSubRows: (row) => row.subRows,
      }));

      const rowModel = table.getCoreRowModel();

      // Top level rows
      expect(rowModel.rows.length).toBe(2);

      // First row has sub-rows
      expect(rowModel.rows[0].subRows.length).toBe(2);
      expect(rowModel.rows[0].subRows[0].original.name).toBe('Phones');

      // Flat rows includes all rows
      expect(rowModel.flatRows.length).toBe(6);
    });

    it('should assign correct depth to rows', () => {
      const table = createTable<Category>(() => ({
        data: hierarchicalData,
        columns: categoryColumns,
        getCoreRowModel: getCoreRowModel(),
        getSubRows: (row) => row.subRows,
      }));

      const rowModel = table.getCoreRowModel();

      // Top level rows have depth 0
      expect(rowModel.rows[0].depth).toBe(0);

      // Sub-rows have depth 1
      expect(rowModel.rows[0].subRows[0].depth).toBe(1);
    });

    it('should assign correct parent id to sub-rows', () => {
      const table = createTable<Category>(() => ({
        data: hierarchicalData,
        columns: categoryColumns,
        getCoreRowModel: getCoreRowModel(),
        getSubRows: (row) => row.subRows,
      }));

      const rowModel = table.getCoreRowModel();

      // Top level rows have no parent
      expect(rowModel.rows[0].parentId).toBeUndefined();

      // Sub-rows have parent id
      expect(rowModel.rows[0].subRows[0].parentId).toBe('0');
    });
  });

  describe('Options reactivity', () => {
    it('should pick up data changes through optionsFn when options is accessed', () => {
      const data = signal(sampleData);

      const table = createTable<Person>(() => ({
        data: data(),
        columns: sampleColumns,
        getCoreRowModel: getCoreRowModel(),
      }));

      // Initial data
      expect(table.getCoreRowModel().rows.length).toBe(3);

      // Update data
      data.set([...sampleData, { id: '4', name: 'Diana', age: 28 }]);

      // Access options to refresh (simulates what happens during change detection)
      const _ = table.options;

      // Should pick up the change
      expect(table.getCoreRowModel().rows.length).toBe(4);
    });
  });
});
