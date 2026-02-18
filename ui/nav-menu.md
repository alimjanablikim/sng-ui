# Navigation Menu

A horizontal or vertical navigation menu for site headers and sidebars. Supports configurable layout direction and panel positioning with hover or click interaction. Hover-to-open uses a debounced close timer to bridge the gap between trigger and panel.

## Installation

```bash
npx @shadng/sng-ui add nav-menu
```

## Basic Usage

```html
<!-- Horizontal (default) -->
<sng-nav-menu>
  <sng-nav-menu-list>
    <sng-nav-menu-item>
      <sng-nav-menu-trigger>Products</sng-nav-menu-trigger>
      <sng-nav-menu-content>
        <a sngNavMenuLink href="/products">All Products</a>
        <a sngNavMenuLink href="/pricing">Pricing</a>
      </sng-nav-menu-content>
    </sng-nav-menu-item>
    <sng-nav-menu-item>
      <a sngNavMenuLink href="/docs" class="h-9 px-4 py-2 inline-flex items-center text-sm font-medium">
        Documentation
      </a>
    </sng-nav-menu-item>
  </sng-nav-menu-list>
</sng-nav-menu>

<!-- Vertical sidebar -->
<sng-nav-menu layout="vertical">
  <sng-nav-menu-list>
    <sng-nav-menu-item>
      <sng-nav-menu-trigger>Settings</sng-nav-menu-trigger>
      <sng-nav-menu-content>
        <a sngNavMenuLink href="/settings/profile">Profile</a>
        <a sngNavMenuLink href="/settings/account">Account</a>
      </sng-nav-menu-content>
    </sng-nav-menu-item>
  </sng-nav-menu-list>
</sng-nav-menu>
```

---

# Technical Reference

The SngNavMenu component provides a pure CSS navigation menu with signal-based state management. No CDK Overlay - content panels use absolute positioning relative to their parent item or the nav bar depending on `align`.

## Component Architecture

```typescript
// 6 components in compound pattern:
// 1. SngNavMenu          - Root container, state manager, layout + side resolver
// 2. SngNavMenuList      - Flex container, adapts direction to layout
// 3. SngNavMenuItem      - Positioning anchor, manages open/close with debounced hover
// 4. SngNavMenuTrigger   - Button with directional chevron
// 5. SngNavMenuContent   - Absolute-positioned panel, side-aware
// 6. SngNavMenuLink      - Styled anchor directive with active state
```

## Component Interfaces

```typescript
// SngNavMenu - Root container, manages state
@Component({ selector: 'sng-nav-menu' })
export class SngNavMenu {
  class = input<string>('');
  layout = input<'horizontal' | 'vertical'>('horizontal');
  side = input<'bottom' | 'top' | 'left' | 'right'>();  // derived from layout
  align = input<'item' | 'full'>('full');                // panel alignment
  hover = input<boolean>(true);                          // hover-to-open
  openItemId = signal<string | null>(null);
  resolvedSide: Signal<'bottom' | 'top' | 'left' | 'right'>;

  openItem(itemId: string): void;
  closeAll(): void;
  isItemOpen(itemId: string): boolean;
}

// SngNavMenuList - Flex container
@Component({ selector: 'sng-nav-menu-list' })
export class SngNavMenuList {
  class = input<string>('');
  // Horizontal: flex-row, space-x-1
  // Vertical: flex-col, space-y-1
}

// SngNavMenuItem - Positioning anchor with debounced hover
@Component({ selector: 'sng-nav-menu-item' })
export class SngNavMenuItem implements OnInit, OnDestroy {
  class = input<string>('');
  isOpen: Signal<boolean>;
  isHoverEnabled: Signal<boolean>;
  toggle(): void;
  open(): void;
  close(): void;
  // onMouseEnter: cancels pending close timer, opens item
  // onMouseLeave: starts 100ms debounced close timer
  // Debounce bridges the gap between trigger and panel (align="full")
}

// SngNavMenuTrigger - Button with directional chevron
@Component({ selector: 'sng-nav-menu-trigger' })
export class SngNavMenuTrigger {
  class = input<string>('');
  // Chevron rotates based on resolved side (down up -> <-)
}

// SngNavMenuContent - Absolute positioned, side-aware
@Component({ selector: 'sng-nav-menu-content' })
export class SngNavMenuContent {
  class = input<string>('');
  // Position by side: bottom -> top-full, top -> bottom-full, etc.
  // Animations: sng-nav-menu-enter/exit (150ms scale 0.95)
}

// SngNavMenuLink - Styled anchor directive
@Directive({ selector: '[sngNavMenuLink]' })
export class SngNavMenuLink {
  class = input<string>('');
  active = input<boolean>(false);   // marks current page
}
```

## Layout and Side

```typescript
// Horizontal drops down by default
<sng-nav-menu layout="horizontal">        // side defaults to "bottom"
<sng-nav-menu layout="horizontal" side="top">  // drops up

// Vertical opens right by default
<sng-nav-menu layout="vertical">          // side defaults to "right"
<sng-nav-menu layout="vertical" side="left">   // opens left
```

Panel positioning classes by side:
- `bottom`: `absolute top-full left-0`
- `top`: `absolute bottom-full left-0`
- `right`: `absolute left-full top-0`
- `left`: `absolute right-full top-0`

## Alignment Modes

```typescript
// 'full' (default): panel positions relative to the nav bar
// Item loses 'relative' class, so absolute panel anchors to nearest relative ancestor (the list)
<sng-nav-menu align="full">

// 'item': panel positions relative to the individual trigger item
// Item gets 'relative' class, so absolute panel anchors to the item
<sng-nav-menu align="item">
```

## Hover Debounce

When `hover` is enabled, `onMouseLeave` starts a 100ms close timer instead of closing immediately. `onMouseEnter` cancels any pending timer. This bridges the CSS gap (`ml-1.5` / `mr-1.5`) between trigger and panel, preventing the panel from closing when the mouse crosses the gap. The timer runs outside Angular's zone to avoid unnecessary change detection.

## Do's and Don'ts

### Do
- Use `layout="vertical"` for sidebar navigation
- Use `side` to control panel direction when the default doesn't fit
- Use `[hover]="false"` for click-only interaction on mobile-friendly layouts
- Use `sngNavMenuLink` on `<a>` elements to preserve native anchor semantics
- Use `align="item"` when panels should stay visually attached to their trigger

### Don't
- Use this for action menus (dropdowns with commands) - use Menu instead
- Nest nav-menus inside each other
- Put interactive form elements inside content panels
