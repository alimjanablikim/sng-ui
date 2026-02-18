# Layout

A collection of layout components for building application structure. Includes headers, footers, and a powerful sidebar system with support for collapsible navigation, nested menus, and responsive behavior.

## Installation

```bash
npx @shadng/sng-ui add layout
```

## Basic Usage

```html
<!-- Simple Header -->
<sng-layout-header>
  <span class="font-semibold">App Name</span>
</sng-layout-header>

<!-- Simple Footer -->
<sng-layout-footer>
  <span>&copy; 2024 Company</span>
</sng-layout-footer>

<!-- Sidebar Layout -->
<sng-layout-sidebar-provider [defaultOpen]="true">
  <sng-layout-sidebar>
    <sng-layout-sidebar-header>App</sng-layout-sidebar-header>
    <sng-layout-sidebar-content>
      <sng-layout-sidebar-menu>
        <sng-layout-sidebar-menu-item>
          <sng-layout-sidebar-menu-button>Dashboard</sng-layout-sidebar-menu-button>
        </sng-layout-sidebar-menu-item>
      </sng-layout-sidebar-menu>
    </sng-layout-sidebar-content>
  </sng-layout-sidebar>
  <sng-layout-sidebar-inset>
    <sng-layout-sidebar-trigger></sng-layout-sidebar-trigger>
    Content
  </sng-layout-sidebar-inset>
</sng-layout-sidebar-provider>
```

---

# Technical Reference

This section covers implementation details for working with Layout components, including sidebar context, collapsible modes, and responsive patterns.

## Component Architecture

```typescript
// 25 components organized in compound pattern:

// STANDALONE (2) - Can be used without sidebar
// 1. SngLayoutHeader          - Page header with flex layout
// 2. SngLayoutFooter          - Page footer with flex layout

// SIDEBAR CORE (5) - Essential sidebar structure
// 3. SngLayoutSidebarProvider - Root context provider, manages state
// 4. SngLayoutSidebar         - Main container with layout/collapsible modes
// 5. SngLayoutSidebarHeader   - Top section for logo/branding
// 6. SngLayoutSidebarContent  - Scrollable navigation area
// 7. SngLayoutSidebarFooter   - Bottom section for user info/actions

// SIDEBAR STRUCTURE (4) - Layout helpers
// 8. SngLayoutSidebarInset    - Main content area alongside sidebar
// 9. SngLayoutSidebarTrigger  - Toggle button for open/close
// 10. SngLayoutSidebarRail    - Thin clickable edge rail for toggle
// 11. SngLayoutSidebarSeparator - Horizontal divider line

// GROUP COMPONENTS (4) - Organize menu sections
// 12. SngLayoutSidebarGroup        - Groups related items with optional label
// 13. SngLayoutSidebarGroupLabel   - Section label (auto-hides in icon mode)
// 14. SngLayoutSidebarGroupContent - Container for grouped items
// 15. SngLayoutSidebarGroupAction  - Action button in group header

// MENU COMPONENTS (9) - Navigation items
// 16. SngLayoutSidebarMenu          - Menu container
// 17. SngLayoutSidebarMenuItem      - Menu item wrapper
// 18. SngLayoutSidebarMenuButton    - Interactive button/link
// 19. SngLayoutSidebarMenuSub       - Nested sub-menu container
// 20. SngLayoutSidebarMenuSubItem   - Sub-menu item wrapper
// 21. SngLayoutSidebarMenuSubButton - Sub-menu button/link
// 22. SngLayoutSidebarMenuAction    - Action button on menu item
// 23. SngLayoutSidebarMenuBadge     - Badge for counts/status
// 24. SngLayoutSidebarMenuSkeleton  - Loading placeholder

// UTILITY (1)
// 25. SngLayoutSidebarInput   - Search/filter input in sidebar
```

## Component Imports

```typescript
// Header & Footer (standalone)
import { SngLayoutHeader, SngLayoutFooter } from 'sng-ui';

// Sidebar system
import {
  SngLayoutSidebarProvider,
  SngLayoutSidebar,
  SngLayoutSidebarHeader,
  SngLayoutSidebarContent,
  SngLayoutSidebarFooter,
  SngLayoutSidebarGroup,
  SngLayoutSidebarGroupLabel,
  SngLayoutSidebarGroupContent,
  SngLayoutSidebarGroupAction,
  SngLayoutSidebarMenu,
  SngLayoutSidebarMenuItem,
  SngLayoutSidebarMenuButton,
  SngLayoutSidebarMenuSub,
  SngLayoutSidebarMenuSubItem,
  SngLayoutSidebarMenuSubButton,
  SngLayoutSidebarMenuAction,
  SngLayoutSidebarMenuBadge,
  SngLayoutSidebarMenuSkeleton,
  SngLayoutSidebarInset,
  SngLayoutSidebarTrigger,
  SngLayoutSidebarRail,
  SngLayoutSidebarSeparator,
  SngLayoutSidebarInput,
} from 'sng-ui';

// Context token (for advanced use)
import { SNG_LAYOUT_SIDEBAR_CONTEXT, type LayoutSidebarContext } from 'sng-ui';
```

## Sidebar Collapsible Modes

```typescript
// Three collapsible modes available:
// 1. "offcanvas" - Sidebar slides in/out of viewport (default)
// 2. "icon" - Sidebar collapses to icon-only view
// 3. "none" - Sidebar is always fully expanded

@Component({
  template: `
    <!-- Offcanvas: slides in/out completely -->
    <sng-layout-sidebar collapsible="offcanvas">...</sng-layout-sidebar>

    <!-- Icon: collapses to icons only, content hidden -->
    <sng-layout-sidebar collapsible="icon">
      <sng-layout-sidebar-menu-item>
        <sng-layout-sidebar-menu-button>
          <svg class="size-4 flex-shrink-0">...</svg>
          <span class="group-data-[collapsible=icon]:hidden">Label</span>
        </sng-layout-sidebar-menu-button>
      </sng-layout-sidebar-menu-item>
    </sng-layout-sidebar>

    <!-- None: always expanded -->
    <sng-layout-sidebar collapsible="none">...</sng-layout-sidebar>
  `
})
```

## Sidebar Layout Styles

```typescript
// Three layout styles available:
// 1. "sidebar" - Fixed positioning with border on edge (default)
// 2. "floating" - Fixed with padding, rounded corners, border, and shadow
// 3. "inset" - Sticky positioning within content flow

@Component({
  template: `
    <!-- Default sidebar: border on edge -->
    <sng-layout-sidebar layout="sidebar">...</sng-layout-sidebar>

    <!-- Floating: padded with rounded corners and shadow -->
    <sng-layout-sidebar layout="floating">...</sng-layout-sidebar>

    <!-- Inset: sticky, contained within page flow -->
    <sng-layout-sidebar layout="inset">...</sng-layout-sidebar>
  `
})
```

## State Management

```typescript
// Uncontrolled - uses defaultOpen, manages state internally
@Component({
  template: `
    <sng-layout-sidebar-provider [defaultOpen]="true">
      ...
    </sng-layout-sidebar-provider>
  `
})

// Controlled from child components via context methods
@Component({
  template: `
    <sng-layout-sidebar-provider [defaultOpen]="sidebarOpen()">
      ...
    </sng-layout-sidebar-provider>
  `
})
export class AppLayout {
  sidebarOpen = signal(true);
}
```

## Sidebar Context Injection

```typescript
// Access and control sidebar state from any child component
import { inject } from '@angular/core';
import { SNG_LAYOUT_SIDEBAR_CONTEXT } from 'sng-ui';

@Component({
  template: `
    <span>Desktop: {{ ctx.state() }}</span>
    <button (click)="ctx.toggle()">Toggle Desktop Sidebar</button>
    <button (click)="ctx.toggleMobile()">Toggle Mobile Drawer</button>
  `
})
export class SidebarControls {
  ctx = inject(SNG_LAYOUT_SIDEBAR_CONTEXT);
}
```

## Nested Menus with Collapsible

```typescript
// Use standalone SngAccordionItem for expandable sub-menus
import { SngAccordionItem, SngAccordionTrigger, SngAccordionContent } from 'sng-ui';

@Component({
  template: `
    <sng-accordion-item [open]="menuOpen()" class="group/collapsible">
      <sng-layout-sidebar-menu-item>
        <sng-accordion-trigger [showChevron]="false" class="w-full p-0 hover:no-underline">
          <sng-layout-sidebar-menu-button class="w-full">
            <svg>...</svg>
            <span>Products</span>
            <!-- Chevron rotates when open -->
            <svg class="ml-auto transition-transform
              group-data-[state=open]/collapsible:rotate-90">
              ...
            </svg>
          </sng-layout-sidebar-menu-button>
        </sng-accordion-trigger>
        <sng-accordion-content class="p-0">
          <sng-layout-sidebar-menu-sub>
            <sng-layout-sidebar-menu-sub-item>
              <sng-layout-sidebar-menu-sub-button href="#">Sub Item</sng-layout-sidebar-menu-sub-button>
            </sng-layout-sidebar-menu-sub-item>
          </sng-layout-sidebar-menu-sub>
        </sng-accordion-content>
      </sng-layout-sidebar-menu-item>
    </sng-accordion-item>
  `
})
export class MyComponent {
  menuOpen = signal(false);
}
```

## Styling Icon Collapse Mode

```html
<!-- Hide text labels when collapsed to icons -->
<sng-layout-sidebar collapsible="icon">
  <sng-layout-sidebar-header>
    <div class="flex items-center gap-2">
      <!-- Icon always visible -->
      <div class="size-6 rounded bg-primary flex-shrink-0"></div>
      <!-- Label hidden when collapsed -->
      <span class="group-data-[collapsible=icon]:hidden">App Name</span>
    </div>
  </sng-layout-sidebar-header>

  <sng-layout-sidebar-menu-item>
    <sng-layout-sidebar-menu-button>
      <svg class="size-4 flex-shrink-0">...</svg>
      <span class="group-data-[collapsible=icon]:hidden">Dashboard</span>
    </sng-layout-sidebar-menu-button>
  </sng-layout-sidebar-menu-item>
</sng-layout-sidebar>
```

## Header and Footer Independence

```typescript
// Header and Footer can be used completely standalone
// They don't require a sidebar

@Component({
  template: `
    <div class="min-h-screen flex flex-col">
      <sng-layout-header>
        <span class="font-semibold">Logo</span>
        <nav class="ml-6 flex gap-4">
          <a href="#">Home</a>
          <a href="#">About</a>
        </nav>
        <div class="flex-1"></div>
        <button>Sign In</button>
      </sng-layout-header>

      <main class="flex-1">
        Content
      </main>

      <sng-layout-footer>
        <span>&copy; 2024 Company</span>
        <div class="flex-1"></div>
        <nav class="flex gap-4">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </nav>
      </sng-layout-footer>
    </div>
  `
})
```

## Responsive Behavior

The sidebar automatically switches between desktop and mobile modes at the `768px` breakpoint (`max-width: 767.98px`).

```
Screen width >= 768px -> Desktop mode
  |-- Sidebar renders as fixed/sticky panel
  |-- Gap div reserves space in document flow
  |-- Collapsible modes work (offcanvas / icon / none)
  `-- State: open / collapsed controlled by toggle()

Screen width < 768px -> Mobile mode
  |-- Sidebar renders as a drawer overlay (fixed, z-50)
  |-- Backdrop overlay blocks page interaction
  |-- Backdrop click closes the drawer
  |-- Body scroll is locked while drawer is open
  `-- State: openMobile / closedMobile controlled by toggleMobile()
```

### How It Works

`SngLayoutSidebarProvider` listens to `window.matchMedia('(max-width: 767.98px)')`. On mode switch:

1. **Desktop -> Mobile**: Saves desktop `open` state, closes mobile drawer
2. **Mobile -> Desktop**: Restores saved desktop state, closes mobile drawer
3. **Transition suppression**: CSS transitions are suppressed during mode switch to prevent visual flicker

`SngLayoutSidebarTrigger` and `SngLayoutSidebarRail` automatically call the correct toggle method (`toggle()` on desktop, `toggleMobile()` on mobile) based on viewport mode.

### Customizing Sidebar Width

```html
<!-- Default: 16rem expanded, 3rem collapsed -->
<sng-layout-sidebar-provider>

<!-- Custom widths via CSS variable inputs -->
<sng-layout-sidebar-provider sidebarWidth="20rem" sidebarWidthIcon="4rem">
```

These map to `--sidebar-width` and `--sidebar-width-icon` CSS custom properties on the host element. All child components reference these variables, so changing the provider inputs is all you need.

### Customizing the Breakpoint

The breakpoint is defined in `SngLayoutSidebarProvider` via `window.matchMedia`. To change it:

```typescript
// In your copy of sng-layout-sidebar-provider.ts, line ~115:
const mql = window.matchMedia('(max-width: 767.98px)');
//                                        ^^^^^^^^
// Change this value to your desired breakpoint, e.g.:
const mql = window.matchMedia('(max-width: 1023.98px)');
```

Also update the Tailwind `md:` prefixes in `SngLayoutSidebar` to match (e.g., change `md:block` / `md:flex` to `lg:block` / `lg:flex`).

### Accessing Responsive State Programmatically

```typescript
import { inject } from '@angular/core';
import { SNG_LAYOUT_SIDEBAR_CONTEXT } from 'sng-ui';

@Component({
  template: `
    <!-- Show hamburger on mobile, panel icon on desktop -->
    @if (ctx.isMobile()) {
      <button (click)="ctx.toggleMobile()">menu</button>
    } @else {
      <sng-layout-sidebar-trigger />
    }

    <!-- Conditionally render based on viewport -->
    <span>Mode: {{ ctx.isMobile() ? 'mobile' : 'desktop' }}</span>
    <span>State: {{ ctx.isMobile() ? (ctx.openMobile() ? 'open' : 'closed') : ctx.state() }}</span>
  `
})
export class MyHeader {
  ctx = inject(SNG_LAYOUT_SIDEBAR_CONTEXT);
}
```

### Context API Reference (Responsive Methods)

| Method / Signal | Type | Description |
|---|---|---|
| `isMobile()` | `boolean` | Whether the viewport is below the mobile breakpoint |
| `openMobile()` | `boolean` | Whether the mobile drawer is currently open |
| `setOpenMobile(open)` | `void` | Set mobile drawer open state |
| `toggleMobile()` | `void` | Toggle mobile drawer open/closed |
| `open()` | `boolean` | Desktop sidebar open state |
| `state()` | `'expanded' \| 'collapsed'` | Desktop sidebar state |
| `setOpen(open)` | `void` | Set desktop sidebar open state |
| `toggle()` | `void` | Toggle desktop sidebar open/collapsed |
| `suppressTransition()` | `boolean` | True during mode switch (suppresses CSS transitions) |

## Do's and Don'ts

### Do
- Use `SngLayoutSidebarProvider` as the root wrapper for sidebar layouts
- Use `SNG_LAYOUT_SIDEBAR_CONTEXT` methods (`setOpen`, `toggle`, `setOpenMobile`, `toggleMobile`) for programmatic control
- Use `collapsible="icon"` with `flex-shrink-0` on icons for smooth transitions
- Hide text labels with `group-data-[collapsible=icon]:hidden` in icon mode
- Use standalone `SngAccordionItem` for nested expandable menus
- Use `SngLayoutSidebarRail` as a clickable edge toggle inside `SngLayoutSidebar`

### Don't
- Don't nest multiple `SngLayoutSidebarProvider` components
- Don't use sidebar components outside of `SngLayoutSidebarProvider`
- Don't forget to add `SngLayoutSidebarInset` for the main content area
- Don't manually manage open state when using `defaultOpen` (uncontrolled)
- Don't use `javascript:` links in menu examples; use `href="#"`, `routerLink`, or a real route

## Common Mistakes

**Sidebar not showing:** Ensure you have both `SngLayoutSidebarProvider` wrapping everything and `SngLayoutSidebar` inside it. The provider creates the context that the sidebar components need.

**Icon mode text not hiding:** Add `group-data-[collapsible=icon]:hidden` class to text elements that should hide when collapsed. The sidebar component adds `data-collapsible="icon"` to enable this.

**Content not filling space:** Use `SngLayoutSidebarInset` for your main content. It's styled to fill the remaining space and handles the sidebar offset.

**Rail not working:** `SngLayoutSidebarRail` is a clickable edge toggle. Make sure it's inside `SngLayoutSidebar` and not covered by custom overlays.

## Accessibility Summary

- Header uses `<header>` element with proper landmark role
- Footer uses `<footer>` element with proper landmark role
- Sidebar trigger includes screen-reader text ("Toggle Sidebar")
- Menu and sub-menu buttons use semantic elements (`<a>` for links, `<button>` otherwise)
- Disabled link-like items expose `aria-disabled` and are removed from tab order
- Focus behavior follows browser defaults
