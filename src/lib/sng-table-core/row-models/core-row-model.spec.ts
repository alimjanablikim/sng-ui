/**
 * @fileoverview Tests for core row model
 */

import { createTable } from '../core/create-table';
import {
  getCoreRowModel,
  createEmptyRowModel,
  filterRows,
  sortRows,
  paginateRows,
  expandRows,
} from './core-row-model';
import { ColumnDef, Row } from '../core/types';

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

const columns: ColumnDef<Person>[] = [
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
  },
];

const categoryColumns: ColumnDef<Category>[] = [
  { accessorKey: 'name', header: 'Category' },
  { accessorKey: 'count', header: 'Items' },
];

describe('getCoreRowModel', () => {
  describe('Factory function', () => {
    it('should return a row model factory', () => {
      const factory = getCoreRowModel();
      expect(typeof factory).toBe('function');
    });

    it('should create rows from data', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns,
        getCoreRowModel: getCoreRowModel(),
      }));

      const rowModel = table.getCoreRowModel();
      expect(rowModel.rows.length).toBe(3);
    });
  });

  describe('Row creation', () => {
    it('should assign correct row properties', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns,
        getCoreRowModel: getCoreRowModel(),
      }));

      const rowModel = table.getCoreRowModel();
      const firstRow = rowModel.rows[0];

      expect(firstRow.id).toBe('0');
      expect(firstRow.index).toBe(0);
      expect(firstRow.original).toBe(sampleData[0]);
      expect(firstRow.depth).toBe(0);
    });

    it('should build flat rows', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns,
        getCoreRowModel: getCoreRowModel(),
      }));

      const rowModel = table.getCoreRowModel();
      expect(rowModel.flatRows.length).toBe(3);
    });

    it('should build rows by id lookup', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns,
        getCoreRowModel: getCoreRowModel(),
      }));

      const rowModel = table.getCoreRowModel();
      expect(rowModel.rowsById['0']).toBeTruthy();
      expect(rowModel.rowsById['1']).toBeTruthy();
      expect(rowModel.rowsById['2']).toBeTruthy();
    });
  });

  describe('Row methods', () => {
    it('should provide getValue method', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns,
        getCoreRowModel: getCoreRowModel(),
      }));

      const row = table.getCoreRowModel().rows[0];
      expect(row.getValue('name')).toBe('Alice');
      expect(row.getValue('age')).toBe(30);
    });

    it('should provide getCell method', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns,
        getCoreRowModel: getCoreRowModel(),
      }));

      const row = table.getCoreRowModel().rows[0];
      const cell = row.getCell('name');

      expect(cell).toBeTruthy();
      expect(cell.getValue()).toBe('Alice');
    });

    it('should provide getAllCells method', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns,
        getCoreRowModel: getCoreRowModel(),
      }));

      const row = table.getCoreRowModel().rows[0];
      const cells = row.getAllCells();

      expect(cells.length).toBe(2);
    });

    it('should provide getVisibleCells method', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns,
        getCoreRowModel: getCoreRowModel(),
      }));

      const row = table.getCoreRowModel().rows[0];
      const cells = row.getVisibleCells();

      expect(cells.length).toBe(2);
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

      expect(rowModel.rows.length).toBe(2);
      expect(rowModel.rows[0].subRows.length).toBe(2);
      expect(rowModel.rows[1].subRows.length).toBe(0);
    });

    it('should flatten all rows including sub-rows', () => {
      const table = createTable<Category>(() => ({
        data: hierarchicalData,
        columns: categoryColumns,
        getCoreRowModel: getCoreRowModel(),
        getSubRows: (row) => row.subRows,
      }));

      const rowModel = table.getCoreRowModel();
      expect(rowModel.flatRows.length).toBe(4); // 2 top + 2 sub
    });

    it('should provide getLeafRows method', () => {
      const table = createTable<Category>(() => ({
        data: hierarchicalData,
        columns: categoryColumns,
        getCoreRowModel: getCoreRowModel(),
        getSubRows: (row) => row.subRows,
      }));

      const electronicsRow = table.getCoreRowModel().rows[0];
      const leafRows = electronicsRow.getLeafRows?.() ?? [];

      expect(leafRows.length).toBe(2);
      expect(leafRows[0].original.name).toBe('Phones');
      expect(leafRows[1].original.name).toBe('Laptops');
    });

    it('should provide getParentRow method', () => {
      const table = createTable<Category>(() => ({
        data: hierarchicalData,
        columns: categoryColumns,
        getCoreRowModel: getCoreRowModel(),
        getSubRows: (row) => row.subRows,
      }));

      const phonesRow = table.getCoreRowModel().rows[0].subRows[0];
      const parent = phonesRow.getParentRow?.();

      expect(parent).toBeTruthy();
      expect(parent?.original.name).toBe('Electronics');
    });
  });

  describe('Custom row ID', () => {
    it('should use custom getRowId function', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.id,
      }));

      const rowModel = table.getCoreRowModel();

      expect(rowModel.rowsById['1']).toBeTruthy();
      expect(rowModel.rowsById['2']).toBeTruthy();
      expect(rowModel.rowsById['3']).toBeTruthy();
    });
  });

  describe('Memoization', () => {
    it('should return same result when data unchanged', () => {
      const table = createTable<Person>(() => ({
        data: sampleData,
        columns,
        getCoreRowModel: getCoreRowModel(),
      }));

      const result1 = table.getCoreRowModel();
      const result2 = table.getCoreRowModel();

      expect(result1).toBe(result2);
    });
  });
});

describe('createEmptyRowModel', () => {
  it('should create an empty row model', () => {
    const emptyModel = createEmptyRowModel<Person>();

    expect(emptyModel.rows).toEqual([]);
    expect(emptyModel.flatRows).toEqual([]);
    expect(emptyModel.rowsById).toEqual({});
  });
});

describe('filterRows', () => {
  let rows: Row<Category>[];

  beforeEach(() => {
    const table = createTable<Category>(() => ({
      data: hierarchicalData,
      columns: categoryColumns,
      getCoreRowModel: getCoreRowModel(),
      getSubRows: (row) => row.subRows,
    }));

    rows = table.getCoreRowModel().rows;
  });

  it('should filter rows based on predicate', () => {
    const filtered = filterRows(rows, (row) => row.original.count >= 200);

    expect(filtered.length).toBe(1);
    expect(filtered[0].original.name).toBe('Clothing');
  });

  it('should include parent if child matches (filterFromLeafRows)', () => {
    const filtered = filterRows(
      rows,
      (row) => row.original.name === 'Phones',
      { filterFromLeafRows: true }
    );

    // Should include Electronics (parent) because Phones matches
    expect(filtered.length).toBe(1);
    expect(filtered[0].original.name).toBe('Electronics');
    expect(filtered[0].subRows.length).toBe(1);
    expect(filtered[0].subRows[0].original.name).toBe('Phones');
  });

  it('should include all children if parent matches (default)', () => {
    const filtered = filterRows(rows, (row) => row.original.name === 'Electronics');

    expect(filtered.length).toBe(1);
    expect(filtered[0].original.name).toBe('Electronics');
    // Children are preserved as-is when parent matches
    expect(filtered[0].subRows.length).toBe(2);
  });
});

describe('sortRows', () => {
  let rows: Row<Category>[];

  beforeEach(() => {
    const table = createTable<Category>(() => ({
      data: hierarchicalData,
      columns: categoryColumns,
      getCoreRowModel: getCoreRowModel(),
      getSubRows: (row) => row.subRows,
    }));

    rows = table.getCoreRowModel().rows;
  });

  it('should sort rows based on comparator', () => {
    const sorted = sortRows(rows, (a, b) => a.original.count - b.original.count);

    expect(sorted[0].original.name).toBe('Electronics'); // 150
    expect(sorted[1].original.name).toBe('Clothing'); // 200
  });

  it('should sort sub-rows recursively', () => {
    const sorted = sortRows(rows, (a, b) => b.original.count - a.original.count);

    // Find the row with sub-rows (Electronics, sorted to second position after Clothing)
    const electronicsRow = sorted.find(r => r.subRows.length > 0);
    expect(electronicsRow).toBeTruthy();

    // Sub-rows should also be sorted (descending by count)
    expect(electronicsRow!.subRows[0].original.name).toBe('Laptops'); // 75
    expect(electronicsRow!.subRows[1].original.name).toBe('Phones'); // 50
  });
});

describe('paginateRows', () => {
  it('should return correct page of rows', () => {
    const table = createTable<Person>(() => ({
      data: sampleData,
      columns,
      getCoreRowModel: getCoreRowModel(),
    }));

    const rows = table.getCoreRowModel().rows;

    const page1 = paginateRows(rows, 0, 2);
    expect(page1.length).toBe(2);
    expect(page1[0].original.name).toBe('Alice');
    expect(page1[1].original.name).toBe('Bob');

    const page2 = paginateRows(rows, 1, 2);
    expect(page2.length).toBe(1);
    expect(page2[0].original.name).toBe('Charlie');
  });

  it('should return empty array for out of bounds page', () => {
    const table = createTable<Person>(() => ({
      data: sampleData,
      columns,
      getCoreRowModel: getCoreRowModel(),
    }));

    const rows = table.getCoreRowModel().rows;
    const page = paginateRows(rows, 10, 2);

    expect(page.length).toBe(0);
  });
});

describe('expandRows', () => {
  let rows: Row<Category>[];

  beforeEach(() => {
    const table = createTable<Category>(() => ({
      data: hierarchicalData,
      columns: categoryColumns,
      getCoreRowModel: getCoreRowModel(),
      getSubRows: (row) => row.subRows,
    }));

    rows = table.getCoreRowModel().rows;
  });

  it('should include sub-rows when parent is expanded', () => {
    const expanded = expandRows(rows, (row) => row.id === '0');

    // Electronics is expanded, so its sub-rows are included
    expect(expanded.length).toBe(4); // Electronics + 2 sub-rows + Clothing
    expect(expanded[0].original.name).toBe('Electronics');
    expect(expanded[1].original.name).toBe('Phones');
    expect(expanded[2].original.name).toBe('Laptops');
    expect(expanded[3].original.name).toBe('Clothing');
  });

  it('should not include sub-rows when parent is collapsed', () => {
    const expanded = expandRows(rows, () => false);

    expect(expanded.length).toBe(2); // Only top-level rows
    expect(expanded[0].original.name).toBe('Electronics');
    expect(expanded[1].original.name).toBe('Clothing');
  });
});
