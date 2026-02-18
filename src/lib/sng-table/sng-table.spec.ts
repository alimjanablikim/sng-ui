import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { SngTable } from './sng-table';
import { SngTableHeader } from './sng-table-header';
import { SngTableBody } from './sng-table-body';
import { SngTableRow } from './sng-table-row';
import { SngTableHead } from './sng-table-head';
import { SngTableCell } from './sng-table-cell';
import { SngTableCaption } from './sng-table-caption';
import { SngTableFooter } from './sng-table-footer';

interface TableRow {
  id: number;
  name: string;
  email: string;
  role: string;
  selected: boolean;
}

@Component({
  standalone: true,
  imports: [
    SngTable,
    SngTableHeader,
    SngTableBody,
    SngTableRow,
    SngTableHead,
    SngTableCell,
    SngTableCaption,
    SngTableFooter,
  ],
  template: `
    <sng-table [class]="customClass()">
      <sng-table-caption>A list of users</sng-table-caption>
      <sng-table-header>
        <sng-table-row>
          <sng-table-head>Name</sng-table-head>
          <sng-table-head>Email</sng-table-head>
          <sng-table-head>Role</sng-table-head>
        </sng-table-row>
      </sng-table-header>
      <sng-table-body>
        @for (row of data(); track row.id) {
          <sng-table-row [selected]="row.selected">
            <sng-table-cell>{{ row.name }}</sng-table-cell>
            <sng-table-cell>{{ row.email }}</sng-table-cell>
            <sng-table-cell>{{ row.role }}</sng-table-cell>
          </sng-table-row>
        }
      </sng-table-body>
      <sng-table-footer>
        <sng-table-row>
          <sng-table-cell colspan="3">Total: {{ data().length }} users</sng-table-cell>
        </sng-table-row>
      </sng-table-footer>
    </sng-table>
  `,
})
class TestHostComponent {
  customClass = signal('');
  data = signal<TableRow[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', selected: false },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', selected: true },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'User', selected: false },
  ]);
}

describe('SngTable', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let table: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    table = fixture.nativeElement.querySelector('sng-table');
    expect(table).toBeTruthy();
  });

  it('should have native table element', () => {
    const nativeTable = fixture.nativeElement.querySelector('table');
    expect(nativeTable).toBeTruthy();
  });

  it('should have caption', () => {
    const caption = fixture.nativeElement.querySelector('sng-table-caption');
    expect(caption).toBeTruthy();
    expect(caption.textContent).toContain('A list of users');
  });

  it('should have header with column names', () => {
    const headers = fixture.nativeElement.querySelectorAll('sng-table-head');
    expect(headers.length).toBe(3);
    expect(headers[0].textContent).toContain('Name');
    expect(headers[1].textContent).toContain('Email');
    expect(headers[2].textContent).toContain('Role');
  });

  it('should have correct number of body rows', () => {
    const bodyRows = fixture.nativeElement.querySelectorAll('sng-table-body sng-table-row');
    expect(bodyRows.length).toBe(3);
  });

  it('should render cell data', () => {
    const cells = fixture.nativeElement.querySelectorAll('sng-table-body sng-table-cell');
    expect(cells[0].textContent).toContain('John Doe');
    expect(cells[1].textContent).toContain('john@example.com');
    expect(cells[2].textContent).toContain('Admin');
  });

  it('should have footer', () => {
    const footer = fixture.nativeElement.querySelector('sng-table-footer');
    expect(footer).toBeTruthy();
    expect(footer.textContent).toContain('Total: 3 users');
  });

  it('should mark selected rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('sng-table-body sng-table-row');
    expect(rows[1].getAttribute('data-state')).toBe('selected');
  });

  it('should apply custom class', async () => {
    host.customClass.set('max-h-96');
    fixture.detectChanges();
    await fixture.whenStable();

    table = fixture.nativeElement.querySelector('sng-table');
    expect(table.classList.contains('max-h-96')).toBeTrue();
  });

  it('should not expose arbitrary selector class hacks on header and body', () => {
    const header = fixture.nativeElement.querySelector('sng-table-header') as HTMLElement;
    const body = fixture.nativeElement.querySelector('sng-table-body') as HTMLElement;

    expect(header.className.includes('[&_')).toBeFalse();
    expect(body.className.includes('[&_')).toBeFalse();
  });

  it('should update when data changes', async () => {
    host.data.set([
      { id: 4, name: 'New User', email: 'new@example.com', role: 'Guest', selected: false },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    const rows = fixture.nativeElement.querySelectorAll('sng-table-body sng-table-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('New User');
  });
});
