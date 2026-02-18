
# ShadNG Breadcrumb

Navigation breadcrumb component for showing user location in site hierarchy. Built with TypeScript and Tailwind CSS. Full ARIA support for accessibility.

## Installation

```bash
npx @shadng/sng-ui add breadcrumb
```

## Basic Usage

```html
<sng-breadcrumb>
  <sng-breadcrumb-list>
    <sng-breadcrumb-item>
      <sng-breadcrumb-link href="/">Home</sng-breadcrumb-link>
    </sng-breadcrumb-item>
    <sng-breadcrumb-separator />
    <sng-breadcrumb-item>
      <sng-breadcrumb-link href="/products">Products</sng-breadcrumb-link>
    </sng-breadcrumb-item>
    <sng-breadcrumb-separator />
    <sng-breadcrumb-item>
      <sng-breadcrumb-page>Current Page</sng-breadcrumb-page>
    </sng-breadcrumb-item>
  </sng-breadcrumb-list>
</sng-breadcrumb>
```

## With Router

```html
<sng-breadcrumb>
  <sng-breadcrumb-list>
    <sng-breadcrumb-item>
      <sng-breadcrumb-link [routerLink]="['/']">Home</sng-breadcrumb-link>
    </sng-breadcrumb-item>
    <sng-breadcrumb-separator />
    <sng-breadcrumb-item>
      <sng-breadcrumb-link [routerLink]="['/settings']">Settings</sng-breadcrumb-link>
    </sng-breadcrumb-item>
    <sng-breadcrumb-separator />
    <sng-breadcrumb-item>
      <sng-breadcrumb-page>Profile</sng-breadcrumb-page>
    </sng-breadcrumb-item>
  </sng-breadcrumb-list>
</sng-breadcrumb>
```

## Custom Separator

```html
<sng-breadcrumb>
  <sng-breadcrumb-list>
    <sng-breadcrumb-item>
      <sng-breadcrumb-link href="/">Home</sng-breadcrumb-link>
    </sng-breadcrumb-item>
    <sng-breadcrumb-separator>/</sng-breadcrumb-separator>
    <sng-breadcrumb-item>
      <sng-breadcrumb-page>Current</sng-breadcrumb-page>
    </sng-breadcrumb-item>
  </sng-breadcrumb-list>
</sng-breadcrumb>
```

## With Ellipsis

```html
<sng-breadcrumb>
  <sng-breadcrumb-list>
    <sng-breadcrumb-item>
      <sng-breadcrumb-link href="/">Home</sng-breadcrumb-link>
    </sng-breadcrumb-item>
    <sng-breadcrumb-separator />
    <sng-breadcrumb-item>
      <sng-breadcrumb-ellipsis />
    </sng-breadcrumb-item>
    <sng-breadcrumb-separator />
    <sng-breadcrumb-item>
      <sng-breadcrumb-page>Current</sng-breadcrumb-page>
    </sng-breadcrumb-item>
  </sng-breadcrumb-list>
</sng-breadcrumb>
```

---

# SngBreadcrumb Technical Reference

High-signal technical documentation for AI coding assistants. No marketing. TypeScript interfaces, component composition, accessibility patterns.

## Component Architecture

```typescript
// 7 components in compound pattern:
// 1. SngBreadcrumb          - Root nav container with ARIA labeling
// 2. SngBreadcrumbList      - Flex container for items and separators
// 3. SngBreadcrumbItem      - Individual item wrapper
// 4. SngBreadcrumbLink      - Component rendering anchor with hover styles
// 5. SngBreadcrumbPage      - Current page indicator (non-clickable)
// 6. SngBreadcrumbSeparator - Visual divider between items (aria-hidden)
// 7. SngBreadcrumbEllipsis  - Collapsed items indicator with sr-only text
```

## API Reference

```typescript
// SngBreadcrumb - Root Navigation Container
interface SngBreadcrumbApi {
  // INPUTS (via input())
  class: InputSignal<string>;  // Default: ''

  // HOST BINDINGS (static)
  // role: 'navigation'
  // aria-label: 'breadcrumb'
}

// SngBreadcrumbList - Items Container
interface SngBreadcrumbListApi {
  class: InputSignal<string>;  // Default: ''
}

// SngBreadcrumbItem - Individual Item Wrapper
interface SngBreadcrumbItemApi {
  class: InputSignal<string>;  // Default: ''
}

// SngBreadcrumbLink - Component Rendering Anchor
interface SngBreadcrumbLinkApi {
  href: InputSignal<string>;   // Default: '#'
  class: InputSignal<string>;  // Default: ''
  // Renders: <a [href]="href()" [class]="linkClasses()">
}

// SngBreadcrumbPage - Current Page Indicator
interface SngBreadcrumbPageApi {
  class: InputSignal<string>;  // Default: ''
  // HOST BINDINGS (static)
  // role: 'link'
  // aria-disabled: 'true'
  // aria-current: 'page'
}

// SngBreadcrumbSeparator - Visual Separator
interface SngBreadcrumbSeparatorApi {
  class: InputSignal<string>;  // Default: ''
  // HOST BINDINGS (static)
  // role: 'presentation'
  // aria-hidden: 'true'
}

// SngBreadcrumbEllipsis - Collapsed Items Indicator
interface SngBreadcrumbEllipsisApi {
  class: InputSignal<string>;  // Default: ''
  // HOST BINDINGS (static)
  // role: 'presentation'
  // aria-hidden: 'true'
}
```

## CDK Usage

```
CDK: NONE

Breadcrumb is purely presentational. No Angular CDK primitives used.
- No overlay positioning
- No focus trapping
- No focus list navigation (standard link navigation only)
- Simple content projection only

All 7 components are standalone with no external dependencies beyond @angular/core.
```

## Import Requirements

```typescript
// ALL 7 COMPONENTS AVAILABLE (import only what you need)
import {
  SngBreadcrumb,
  SngBreadcrumbList,
  SngBreadcrumbItem,
  SngBreadcrumbLink,
  SngBreadcrumbPage,
  SngBreadcrumbSeparator,
  SngBreadcrumbEllipsis,
} from 'sng-ui';

@Component({
  standalone: true,
  imports: [
    SngBreadcrumb,
    SngBreadcrumbList,
    SngBreadcrumbItem,
    SngBreadcrumbLink,
    SngBreadcrumbPage,
    SngBreadcrumbSeparator,
    // SngBreadcrumbEllipsis - only if using collapsed pattern
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent { }
```

## Complete Composition Structure

```html
<!-- Full component hierarchy -->
<sng-breadcrumb>                    <!-- role="navigation" -->
  <sng-breadcrumb-list>
    <sng-breadcrumb-item>
      <sng-breadcrumb-link href="/">
        Home
      </sng-breadcrumb-link>
    </sng-breadcrumb-item>
    <sng-breadcrumb-separator />    <!-- aria-hidden -->
    <sng-breadcrumb-item>
      <sng-breadcrumb-link href="/products">
        Products
      </sng-breadcrumb-link>
    </sng-breadcrumb-item>
    <sng-breadcrumb-separator />
    <sng-breadcrumb-item>
      <sng-breadcrumb-page>         <!-- aria-current="page" -->
        Current Page
      </sng-breadcrumb-page>
    </sng-breadcrumb-item>
  </sng-breadcrumb-list>
</sng-breadcrumb>
```

## Host Bindings Reference

```typescript
// Complete host binding map for each component

// SngBreadcrumb
host: {
  'role': 'navigation',
  'aria-label': 'breadcrumb',
  '[class]': 'hostClasses()',
}

// SngBreadcrumbList
host: {
  '[class]': 'hostClasses()',
}

// SngBreadcrumbItem
host: {
  '[class]': 'hostClasses()',
}

// SngBreadcrumbLink
host: {
  'class': 'contents',  // Transparent wrapper
}

// SngBreadcrumbPage
host: {
  'role': 'link',
  'aria-disabled': 'true',
  'aria-current': 'page',
  '[class]': 'hostClasses()',
}

// SngBreadcrumbSeparator
host: {
  'role': 'presentation',
  'aria-hidden': 'true',
  '[class]': 'hostClasses()',
}

// SngBreadcrumbEllipsis
host: {
  'role': 'presentation',
  'aria-hidden': 'true',
  '[class]': 'hostClasses()',
}
```

## CSS Class Reference

```typescript
// SngBreadcrumb - No base classes (container only)
hostClasses = computed(() => cn(this.class()));

// SngBreadcrumbList
hostClasses = computed(() => cn(
  'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
  this.class()
));

// SngBreadcrumbItem
hostClasses = computed(() => cn(
  'inline-flex items-center gap-1.5',
  this.class()
));

// SngBreadcrumbLink (applied to inner <a> element)
linkClasses = computed(() => cn(
  'transition-colors hover:text-foreground',
  this.class()
));

// SngBreadcrumbPage
hostClasses = computed(() => cn(
  'font-normal text-foreground',
  this.class()
));

// SngBreadcrumbSeparator
hostClasses = computed(() => cn(
  this.class()
));

// SngBreadcrumbEllipsis
hostClasses = computed(() => cn(
  'flex h-9 w-9 items-center justify-center',
  this.class()
));
```

## Separator Customization

```html
<!-- Default: Chevron-right SVG icon -->
<sng-breadcrumb-separator />

<!-- Custom text separator -->
<sng-breadcrumb-separator>/</sng-breadcrumb-separator>
<sng-breadcrumb-separator>-></sng-breadcrumb-separator>
<sng-breadcrumb-separator>|</sng-breadcrumb-separator>

<!-- Custom icon separator -->
<sng-breadcrumb-separator>
  <my-custom-icon class="size-4" />
</sng-breadcrumb-separator>

<!-- Styled separator -->
<sng-breadcrumb-separator class="text-primary">
  <svg class="size-5">...</svg>
</sng-breadcrumb-separator>
```

## Ellipsis Pattern

```typescript
// Use ellipsis when path is too long
// Typically shows: Home > ... > Parent > Current

// Pattern 1: Simple ellipsis (no interaction)
<sng-breadcrumb-item>
  <sng-breadcrumb-ellipsis />
</sng-breadcrumb-item>

// Pattern 2: Ellipsis with dropdown (requires additional components)
<sng-breadcrumb-item>
  <sng-dropdown-menu>
    <button sng-dropdown-menu-trigger>
      <sng-breadcrumb-ellipsis class="cursor-pointer" />
    </button>
    <sng-dropdown-menu-content>
      <a sng-dropdown-menu-item href="/level-1">Level 1</a>
      <a sng-dropdown-menu-item href="/level-2">Level 2</a>
      <a sng-dropdown-menu-item href="/level-3">Level 3</a>
    </sng-dropdown-menu-content>
  </sng-dropdown-menu>
</sng-breadcrumb-item>
```

## Router Integration

```typescript
// SngBreadcrumbLink works with both href and routerLink

// Static href
<sng-breadcrumb-link href="/products">Products</sng-breadcrumb-link>

// Angular Router
<sng-breadcrumb-link [routerLink]="['/products']">Products</sng-breadcrumb-link>

// With query params
<sng-breadcrumb-link [routerLink]="['/search']" [queryParams]="{q: 'test'}">
  Search
</sng-breadcrumb-link>

// Dynamic breadcrumb from route data
@Component({
  template: `
    <sng-breadcrumb>
      <sng-breadcrumb-list>
        @for (crumb of breadcrumbs(); track crumb.path) {
          <sng-breadcrumb-item>
            @if (crumb.isLast) {
              <sng-breadcrumb-page>{{ crumb.label }}</sng-breadcrumb-page>
            } @else {
              <sng-breadcrumb-link [routerLink]="crumb.path">{{ crumb.label }}</sng-breadcrumb-link>
            }
          </sng-breadcrumb-item>
          @if (!crumb.isLast) {
            <sng-breadcrumb-separator />
          }
        }
      </sng-breadcrumb-list>
    </sng-breadcrumb>
  `
})
export class BreadcrumbComponent {
  breadcrumbs = computed(() => this.buildBreadcrumbs());
}
```

## Accessibility Patterns

```html
<!-- Generated ARIA structure -->
<sng-breadcrumb
  role="navigation"
  aria-label="breadcrumb">
  <sng-breadcrumb-list>
    <sng-breadcrumb-item>
      <sng-breadcrumb-link href="/">
        Home
      </sng-breadcrumb-link>
    </sng-breadcrumb-item>
    <sng-breadcrumb-separator
      role="presentation"
      aria-hidden="true">
      <!-- SVG hidden from screen readers -->
    </sng-breadcrumb-separator>
    <sng-breadcrumb-item>
      <sng-breadcrumb-page
        role="link"
        aria-disabled="true"
        aria-current="page">
        Current Page
      </sng-breadcrumb-page>
    </sng-breadcrumb-item>
  </sng-breadcrumb-list>
</sng-breadcrumb>

<!-- Screen reader announces: "breadcrumb navigation, Home link, Current Page, current page" -->
```

## Do's and Don'ts

### Do
- Always wrap items in `<sng-breadcrumb-list>`
- Use `sng-breadcrumb-link` component with `href` input for navigation
- Use `sng-breadcrumb-page` for the final (non-clickable) item
- Place separators between items only, not after the last item
- Use semantic page names that describe the content
- Add `routerLink` or `href` to all link elements
- Test with screen readers to verify announcement order

### Don't
- Don't use `sng-breadcrumb-link` on the current page (use `sng-breadcrumb-page`)
- Don't add separator after the last breadcrumb item
- Don't nest `sng-breadcrumb` components
- Don't apply click handlers to `sng-breadcrumb-page` (it's non-interactive)
- Don't forget to pass `href` or `routerLink` to `sng-breadcrumb-link`
- Don't forget `sng-breadcrumb-list` wrapper (required for flex layout)

## Common Mistakes

1. **Forgetting `sng-breadcrumb-list` wrapper** - Items won't flex properly without the list container.

2. **Missing href on breadcrumb link** - Always provide `href` or `routerLink` to `<sng-breadcrumb-link>` for navigation.

3. **Adding separator after the last item** - Creates visual noise. Only place separators BETWEEN items.

4. **Missing `routerLink` or `href` on links** - Links become non-functional without navigation target.

5. **Using `sng-breadcrumb-link` for current page** - Current page should use `sng-breadcrumb-page` with `aria-current="page"`.

6. **Breadcrumb too deep (>5 levels)** - Use ellipsis pattern to collapse middle items.

7. **Not importing all required components** - Minimum: `SngBreadcrumb`, `SngBreadcrumbList`, `SngBreadcrumbItem`, plus `SngBreadcrumbLink` OR `SngBreadcrumbPage`, plus `SngBreadcrumbSeparator`.

## Performance Notes

```typescript
// All components use OnPush change detection
changeDetection: ChangeDetectionStrategy.OnPush

// All components use ViewEncapsulation.None for Tailwind
encapsulation: ViewEncapsulation.None

// All styling via computed() signals - memoized
hostClasses = computed(() => cn(...))

// No subscriptions, no cleanup needed
// Simple content projection, minimal runtime overhead

// Bundle impact: ~2KB total for all 7 components (gzipped)
```

## Accessibility Summary

### Automatic ARIA (no configuration needed)
- `role="navigation"` on root element
- `aria-label="breadcrumb"` for landmark identification
- `aria-current="page"` on current page element
- `aria-disabled="true"` on non-interactive current page
- `role="presentation"` on decorative separators
- `aria-hidden="true"` on separator icons

### Focus Navigation
- Standard browser link navigation behavior
- Links use standard browser activation behavior
- No special focus handling (not a widget, just navigation)

### Screen Reader Behavior
- Announces as "breadcrumb navigation" landmark
- Reads links in order
- Announces current page with "current page" indicator
- Skips decorative separators (aria-hidden)
