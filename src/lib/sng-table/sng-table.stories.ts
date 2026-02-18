import { type Meta, type StoryObj } from '@storybook/angular';
import { SngTable } from './sng-table';
import { SngTableHeader } from './sng-table-header';
import { SngTableBody } from './sng-table-body';
import { SngTableRow } from './sng-table-row';
import { SngTableHead } from './sng-table-head';
import { SngTableCell } from './sng-table-cell';
import { SngTableCaption } from './sng-table-caption';
import { SngTableFooter } from './sng-table-footer';

const meta: Meta<SngTable> = {
  title: 'UI/Table',
  component: SngTable,
  tags: ['autodocs'],
  argTypes: {
    class: {
      control: 'text',
      description: 'Custom CSS classes for container',
    },
    tableClass: {
      control: 'text',
      description: 'Custom CSS classes for table element',
    },
  },
};

export default meta;
type Story = StoryObj<SngTable>;

const invoices = [
  { invoice: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
  { invoice: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
  { invoice: 'INV003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
  { invoice: 'INV004', status: 'Paid', method: 'Credit Card', amount: '$450.00' },
  { invoice: 'INV005', status: 'Paid', method: 'PayPal', amount: '$550.00' },
  { invoice: 'INV006', status: 'Pending', method: 'Bank Transfer', amount: '$200.00' },
  { invoice: 'INV007', status: 'Unpaid', method: 'Credit Card', amount: '$300.00' },
];

/**
 * Default table with invoices data.
 */
export const Default: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngTable,
        SngTableHeader,
        SngTableBody,
        SngTableRow,
        SngTableHead,
        SngTableCell,
        SngTableCaption,
      ],
    },
    props: { invoices },
    template: `
      <sng-table>
        <sng-table-caption>A list of your recent invoices.</sng-table-caption>
        <sng-table-header>
          <sng-table-row>
            <sng-table-head class="w-[100px]">Invoice</sng-table-head>
            <sng-table-head>Status</sng-table-head>
            <sng-table-head>Method</sng-table-head>
            <sng-table-head class="text-right">Amount</sng-table-head>
          </sng-table-row>
        </sng-table-header>
        <sng-table-body>
          @for (inv of invoices; track inv.invoice) {
            <sng-table-row>
              <sng-table-cell class="font-medium">{{ inv.invoice }}</sng-table-cell>
              <sng-table-cell>{{ inv.status }}</sng-table-cell>
              <sng-table-cell>{{ inv.method }}</sng-table-cell>
              <sng-table-cell class="text-right">{{ inv.amount }}</sng-table-cell>
            </sng-table-row>
          }
        </sng-table-body>
      </sng-table>
    `,
  }),
};

/**
 * Table with footer showing totals.
 */
export const WithFooter: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngTable,
        SngTableHeader,
        SngTableBody,
        SngTableRow,
        SngTableHead,
        SngTableCell,
        SngTableFooter,
      ],
    },
    props: { invoices: invoices.slice(0, 4) },
    template: `
      <sng-table>
        <sng-table-header>
          <sng-table-row>
            <sng-table-head class="w-[100px]">Invoice</sng-table-head>
            <sng-table-head>Status</sng-table-head>
            <sng-table-head>Method</sng-table-head>
            <sng-table-head class="text-right">Amount</sng-table-head>
          </sng-table-row>
        </sng-table-header>
        <sng-table-body>
          @for (inv of invoices; track inv.invoice) {
            <sng-table-row>
              <sng-table-cell class="font-medium">{{ inv.invoice }}</sng-table-cell>
              <sng-table-cell>{{ inv.status }}</sng-table-cell>
              <sng-table-cell>{{ inv.method }}</sng-table-cell>
              <sng-table-cell class="text-right">{{ inv.amount }}</sng-table-cell>
            </sng-table-row>
          }
        </sng-table-body>
        <sng-table-footer>
          <sng-table-row>
            <sng-table-cell colspan="3">Total</sng-table-cell>
            <sng-table-cell class="text-right font-bold">$1,200.00</sng-table-cell>
          </sng-table-row>
        </sng-table-footer>
      </sng-table>
    `,
  }),
};

/**
 * Table with selected rows.
 */
export const WithSelectedRows: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngTable,
        SngTableHeader,
        SngTableBody,
        SngTableRow,
        SngTableHead,
        SngTableCell,
      ],
    },
    props: {
      invoices: invoices.slice(0, 5),
      selected: [1, 3],
    },
    template: `
      <sng-table>
        <sng-table-header>
          <sng-table-row>
            <sng-table-head class="w-[100px]">Invoice</sng-table-head>
            <sng-table-head>Status</sng-table-head>
            <sng-table-head>Method</sng-table-head>
            <sng-table-head class="text-right">Amount</sng-table-head>
          </sng-table-row>
        </sng-table-header>
        <sng-table-body>
          @for (inv of invoices; track inv.invoice; let i = $index) {
            <sng-table-row [selected]="selected.includes(i)">
              <sng-table-cell class="font-medium">{{ inv.invoice }}</sng-table-cell>
              <sng-table-cell>{{ inv.status }}</sng-table-cell>
              <sng-table-cell>{{ inv.method }}</sng-table-cell>
              <sng-table-cell class="text-right">{{ inv.amount }}</sng-table-cell>
            </sng-table-row>
          }
        </sng-table-body>
      </sng-table>
    `,
  }),
};

const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Carol Williams', email: 'carol@example.com', role: 'User', status: 'Inactive' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'Moderator', status: 'Active' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'User', status: 'Pending' },
];

/**
 * User management table example.
 */
export const UserTable: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngTable,
        SngTableHeader,
        SngTableBody,
        SngTableRow,
        SngTableHead,
        SngTableCell,
      ],
    },
    props: { users },
    template: `
      <sng-table>
        <sng-table-header>
          <sng-table-row>
            <sng-table-head class="w-[50px]">ID</sng-table-head>
            <sng-table-head>Name</sng-table-head>
            <sng-table-head>Email</sng-table-head>
            <sng-table-head>Role</sng-table-head>
            <sng-table-head>Status</sng-table-head>
          </sng-table-row>
        </sng-table-header>
        <sng-table-body>
          @for (user of users; track user.id) {
            <sng-table-row>
              <sng-table-cell class="font-medium">{{ user.id }}</sng-table-cell>
              <sng-table-cell>{{ user.name }}</sng-table-cell>
              <sng-table-cell class="text-muted-foreground">{{ user.email }}</sng-table-cell>
              <sng-table-cell>
                <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset"
                  [class]="user.role === 'Admin' ? 'bg-primary/10 text-primary ring-primary/20' :
                           user.role === 'Moderator' ? 'bg-yellow-500/10 text-yellow-600 ring-yellow-500/20' :
                           'bg-muted text-muted-foreground ring-border'">
                  {{ user.role }}
                </span>
              </sng-table-cell>
              <sng-table-cell>
                <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                  [class]="user.status === 'Active' ? 'bg-green-500/10 text-green-600' :
                           user.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-600' :
                           'bg-muted text-muted-foreground'">
                  {{ user.status }}
                </span>
              </sng-table-cell>
            </sng-table-row>
          }
        </sng-table-body>
      </sng-table>
    `,
  }),
};

/**
 * Empty table state.
 */
export const EmptyTable: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngTable,
        SngTableHeader,
        SngTableBody,
        SngTableRow,
        SngTableHead,
        SngTableCell,
      ],
    },
    template: `
      <sng-table>
        <sng-table-header>
          <sng-table-row>
            <sng-table-head class="w-[100px]">Invoice</sng-table-head>
            <sng-table-head>Status</sng-table-head>
            <sng-table-head>Method</sng-table-head>
            <sng-table-head class="text-right">Amount</sng-table-head>
          </sng-table-row>
        </sng-table-header>
        <sng-table-body>
          <sng-table-row>
            <sng-table-cell colspan="4" class="h-24 text-center text-muted-foreground">
              No results found.
            </sng-table-cell>
          </sng-table-row>
        </sng-table-body>
      </sng-table>
    `,
  }),
};

/**
 * Compact table with striped rows.
 */
export const StripedTable: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngTable,
        SngTableHeader,
        SngTableBody,
        SngTableRow,
        SngTableHead,
        SngTableCell,
      ],
    },
    props: { invoices },
    template: `
      <sng-table>
        <sng-table-header>
          <sng-table-row>
            <sng-table-head class="w-[100px]">Invoice</sng-table-head>
            <sng-table-head>Status</sng-table-head>
            <sng-table-head>Method</sng-table-head>
            <sng-table-head class="text-right">Amount</sng-table-head>
          </sng-table-row>
        </sng-table-header>
        <sng-table-body>
          @for (inv of invoices; track inv.invoice; let odd = $odd) {
            <sng-table-row [class]="odd ? 'bg-muted/50' : ''">
              <sng-table-cell class="font-medium">{{ inv.invoice }}</sng-table-cell>
              <sng-table-cell>{{ inv.status }}</sng-table-cell>
              <sng-table-cell>{{ inv.method }}</sng-table-cell>
              <sng-table-cell class="text-right">{{ inv.amount }}</sng-table-cell>
            </sng-table-row>
          }
        </sng-table-body>
      </sng-table>
    `,
  }),
};
