/**
 * @fileoverview sng-layout components
 *
 * Layout components for building page structures with header, footer, and sidebar.
 *
 * @example
 * ```typescript
 * import {
 *   SngLayoutHeader,
 *   SngLayoutFooter,
 *   SngLayoutSidebarProvider,
 *   SngLayoutSidebar,
 *   SngLayoutSidebarContent,
 *   SngLayoutSidebarMenu,
 *   SngLayoutSidebarMenuItem,
 *   SngLayoutSidebarMenuButton,
 *   SngLayoutSidebarInset,
 * } from 'sng-ui';
 *
 * @Component({
 *   imports: [
 *     SngLayoutHeader,
 *     SngLayoutFooter,
 *     SngLayoutSidebarProvider,
 *     SngLayoutSidebar,
 *     SngLayoutSidebarContent,
 *     SngLayoutSidebarMenu,
 *     SngLayoutSidebarMenuItem,
 *     SngLayoutSidebarMenuButton,
 *     SngLayoutSidebarInset,
 *   ],
 *   template: `
 *     <sng-layout-sidebar-provider>
 *       <sng-layout-sidebar>
 *         <sng-layout-sidebar-content>
 *           <sng-layout-sidebar-menu>
 *             <sng-layout-sidebar-menu-item>
 *               <sng-layout-sidebar-menu-button routerLink="/home">Home</sng-layout-sidebar-menu-button>
 *             </sng-layout-sidebar-menu-item>
 *           </sng-layout-sidebar-menu>
 *         </sng-layout-sidebar-content>
 *       </sng-layout-sidebar>
 *       <sng-layout-sidebar-inset>
 *         <sng-layout-header>Header content</sng-layout-header>
 *         <main>Main content</main>
 *         <sng-layout-footer>Footer content</sng-layout-footer>
 *       </sng-layout-sidebar-inset>
 *     </sng-layout-sidebar-provider>
 *   `
 * })
 * export class MyLayoutComponent { }
 * ```
 */

// Header & Footer (can be used standalone)
export { SngLayoutHeader } from './sng-layout-header';
export { SngLayoutFooter } from './sng-layout-footer';

// Sidebar Provider & Context
export {
  SngLayoutSidebarProvider,
  SNG_LAYOUT_SIDEBAR_CONTEXT,
  type LayoutSidebarContext,
  type LayoutSidebarDirection,
} from './sng-layout-sidebar-provider';

// Sidebar Main Components
export {
  SngLayoutSidebar,
  type LayoutSidebarSide,
  type LayoutSidebarCollapsible,
  type LayoutSidebarLayout,
} from './sng-layout-sidebar';
export { SngLayoutSidebarHeader } from './sng-layout-sidebar-header';
export { SngLayoutSidebarContent } from './sng-layout-sidebar-content';
export { SngLayoutSidebarFooter } from './sng-layout-sidebar-footer';
export { SngLayoutSidebarInset } from './sng-layout-sidebar-inset';
export { SngLayoutSidebarTrigger } from './sng-layout-sidebar-trigger';
export { SngLayoutSidebarRail } from './sng-layout-sidebar-rail';
export { SngLayoutSidebarSeparator } from './sng-layout-sidebar-separator';
export { SngLayoutSidebarInput } from './sng-layout-sidebar-input';

// Sidebar Group Components
export { SngLayoutSidebarGroup } from './sng-layout-sidebar-group';
export { SngLayoutSidebarGroupLabel } from './sng-layout-sidebar-group-label';
export { SngLayoutSidebarGroupContent } from './sng-layout-sidebar-group-content';
export { SngLayoutSidebarGroupAction } from './sng-layout-sidebar-group-action';

// Sidebar Menu Components
export { SngLayoutSidebarMenu } from './sng-layout-sidebar-menu';
export { SngLayoutSidebarMenuItem } from './sng-layout-sidebar-menu-item';
export { SngLayoutSidebarMenuButton, type LayoutSidebarMenuButtonSize } from './sng-layout-sidebar-menu-button';
export { SngLayoutSidebarMenuSub } from './sng-layout-sidebar-menu-sub';
export { SngLayoutSidebarMenuSubItem } from './sng-layout-sidebar-menu-sub-item';
export { SngLayoutSidebarMenuSubButton } from './sng-layout-sidebar-menu-sub-button';
export { SngLayoutSidebarMenuAction } from './sng-layout-sidebar-menu-action';
export { SngLayoutSidebarMenuBadge } from './sng-layout-sidebar-menu-badge';
export { SngLayoutSidebarMenuSkeleton } from './sng-layout-sidebar-menu-skeleton';
