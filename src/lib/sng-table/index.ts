/**
 * @fileoverview sng-table UI components
 *
 * Styled table components that work with sng-table-core.
 *
 * @example
 * ```typescript
 * import {
 *   SngTable,
 *   SngTableHeader,
 *   SngTableBody,
 *   SngTableRow,
 *   SngTableHead,
 *   SngTableCell,
 *   SngFlexRenderDirective,
 * } from 'sng-ui';
 *
 * @Component({
 *   imports: [
 *     SngTable,
 *     SngTableHeader,
 *     SngTableBody,
 *     SngTableRow,
 *     SngTableHead,
 *     SngTableCell,
 *     SngFlexRenderDirective,
 *   ],
 *   template: `
 *     <sng-table>
 *       <sng-table-header>
 *         @for (headerGroup of table.getHeaderGroups(); track headerGroup.id) {
 *           <sng-table-row>
 *             @for (header of headerGroup.headers; track header.id) {
 *               <sng-table-head>
 *                 <ng-container *sngFlexRender="header.column.columnDef.header; context: header.getContext()">
 *                   {{ header.column.id }}
 *                 </ng-container>
 *               </sng-table-head>
 *             }
 *           </sng-table-row>
 *         }
 *       </sng-table-header>
 *       <sng-table-body>
 *         @for (row of table.getRowModel().rows; track row.id) {
 *           <sng-table-row [selected]="row.getIsSelected?.()">
 *             @for (cell of row.getVisibleCells(); track cell.id) {
 *               <sng-table-cell>
 *                 <ng-container *sngFlexRender="cell.column.columnDef.cell; context: cell.getContext()">
 *                   {{ cell.getValue() }}
 *                 </ng-container>
 *               </sng-table-cell>
 *             }
 *           </sng-table-row>
 *         }
 *       </sng-table-body>
 *     </sng-table>
 *   `
 * })
 * export class MyTableComponent { ... }
 * ```
 */

// Table components
export { SngTable } from './sng-table';
export { SngTableHeader } from './sng-table-header';
export { SngTableBody } from './sng-table-body';
export { SngTableRow } from './sng-table-row';
export { SngTableHead } from './sng-table-head';
export { SngTableCell } from './sng-table-cell';
export { SngTableCaption } from './sng-table-caption';
export { SngTableFooter } from './sng-table-footer';

// Pagination
export {
  SngTablePagination,
  type SngTablePaginationLayout,
} from './sng-table-pagination';

// Flex render
export {
  SngFlexRenderDirective,
  SngFlexRenderComponent,
  flexRender,
  type FlexRenderContext,
} from './flex-render';
