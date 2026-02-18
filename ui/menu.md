
# Menu

A unified, flexible menu component that supports dropdown menus, context menus, and menubar patterns through composable trigger directives.

## Installation

```bash
npx @shadng/sng-ui add menu
```

## Basic Usage

```html
<!-- Dropdown Menu -->
<button [sngMenuTrigger]="myMenu">Options</button>
<sng-menu #myMenu>
  <sng-menu-item>Edit</sng-menu-item>
  <sng-menu-item>Delete</sng-menu-item>
</sng-menu>

<!-- Context Menu -->
<div [sngContextTrigger]="contextMenu">Right-click here</div>
<sng-menu #contextMenu>
  <sng-menu-item>Cut</sng-menu-item>
  <sng-menu-item>Copy</sng-menu-item>
  <sng-menu-item>Paste</sng-menu-item>
</sng-menu>

<!-- Menubar -->
<nav class="flex gap-1 border rounded p-1" #menubarNav>
  <button [sngMenuTrigger]="fileMenu" [origin]="menubarNav" align="start">File</button>
  <sng-menu #fileMenu>
    <sng-menu-item>New</sng-menu-item>
    <sng-menu-item>Open</sng-menu-item>
  </sng-menu>

  <button [sngMenuTrigger]="editMenu" align="center">Edit</button>
  <sng-menu #editMenu>
    <sng-menu-item>Undo</sng-menu-item>
    <sng-menu-item>Redo</sng-menu-item>
  </sng-menu>
</nav>
```

---

# Technical Reference

The SngMenu component provides a unified approach to building dropdown menus, context menus, and menubars in Angular. Instead of three separate component sets, you have one core menu component with different trigger directives.

## Component Architecture

```typescript
// 13 components in compound pattern:
//
// Triggers & Container:
// 1. SngMenu              - Content template, close-on-select default
// 2. SngMenuTrigger       - Click trigger, owns CDK Overlay lifecycle
// 3. SngContextTrigger    - Right-click trigger, owns CDK Overlay lifecycle
//
// Item Components:
// 4. SngMenuItem          - Standard clickable item (Directive)
// 5. SngMenuCheckboxItem  - Toggle item with two-way checked binding
// 6. SngMenuRadioGroup    - Single-selection container
// 7. SngMenuRadioItem     - Radio option within group
//
// Visual Components:
// 8. SngMenuLabel         - Non-interactive section header
// 9. SngMenuSeparator     - Horizontal divider
// 10. SngMenuShortcut     - Focus hint display (right-aligned)
//
// Submenu Components:
// 11. SngMenuSub          - Submenu container, opens on hover
// 12. SngMenuSubTrigger   - Submenu trigger with chevron icon
// 13. SngMenuSubContent   - Submenu content panel (own CDK Overlay)
```

## Component Interfaces

```typescript
// SngMenu - Content template and close-on-select behavior
@Component({ selector: 'sng-menu' })
export class SngMenu {
  class = input<string>('');
  closeOnSelect = input<boolean>(true);   // Items inherit this default
  isOpen = signal(false);                 // Set by trigger
  currentSide = signal<'top' | 'bottom' | 'left' | 'right'>('bottom');
  close(): void;                          // Delegates to trigger
}

// SngMenuTrigger - Click trigger, owns CDK Overlay
@Directive({ selector: '[sngMenuTrigger]' })
export class SngMenuTrigger {
  menu = input.required<SngMenu>({ alias: 'sngMenuTrigger' });
  side = input<'top' | 'right' | 'bottom' | 'left'>('bottom');
  align = input<'start' | 'center' | 'end'>('start');
  origin = input<HTMLElement>();     // Position relative to this element instead of trigger
  open(): void;
  close(): void;    // Exit animation -> dispose overlay
  toggle(): void;
}

// SngContextTrigger - Right-click trigger, owns CDK Overlay
@Directive({ selector: '[sngContextTrigger]' })
export class SngContextTrigger {
  menu = input.required<SngMenu>({ alias: 'sngContextTrigger' });
  // Opens at cursor position on contextmenu event
}
```

## Focus Behavior Contract (Copy-Paste Default)

```typescript
// When a menu opens (trigger, context menu, or submenu):
// 1) Focus first interactive item:
//    [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]
// 2) If no interactive items exist, focus the menu panel as fallback.
//
// Why:
// - Immediate focus placement without extra app code.
// - No browser default blue outline ring on the panel in normal menus.
// - Works out-of-the-box for users who copy components into their own project.
```

## Menu Item Components

```html
<!-- Standard clickable item (Directive, not Component) -->
<sng-menu-item>Action</sng-menu-item>
<sng-menu-item [isDisabled]="true">Disabled</sng-menu-item>
<sng-menu-item inset>Inset Item</sng-menu-item>

<!-- Checkbox item with two-way binding via model() -->
<sng-menu-checkbox-item [(checked)]="showToolbar">
  Show Toolbar
</sng-menu-checkbox-item>

<!-- Radio group with two-way binding via model() -->
<sng-menu-radio-group [(value)]="theme">
  <sng-menu-radio-item value="light">Light</sng-menu-radio-item>
  <sng-menu-radio-item value="dark">Dark</sng-menu-radio-item>
</sng-menu-radio-group>

<!-- Visual elements -->
<sng-menu-label>Section Title</sng-menu-label>
<sng-menu-separator />
<sng-menu-item>
  Save <sng-menu-shortcut>Ctrl+S</sng-menu-shortcut>
</sng-menu-item>
```

## Submenus

```html
<!-- Nested submenu structure - supports multiple levels of nesting -->
<sng-menu>
  <sng-menu-item>Regular Item</sng-menu-item>

  <sng-menu-sub>
    <sng-menu-sub-trigger>More Options</sng-menu-sub-trigger>
    <sng-menu-sub-content>
      <sng-menu-item>Nested Item 1</sng-menu-item>
      <sng-menu-item>Nested Item 2</sng-menu-item>

      <!-- Deeply nested -->
      <sng-menu-sub>
        <sng-menu-sub-trigger>Even More</sng-menu-sub-trigger>
        <sng-menu-sub-content>
          <sng-menu-item>Deep Item</sng-menu-item>
        </sng-menu-sub-content>
      </sng-menu-sub>
    </sng-menu-sub-content>
  </sng-menu-sub>
</sng-menu>
```

## Dropdown Menu Pattern

```html
<!-- Basic dropdown with positioning -->
<sng-button [sngMenuTrigger]="menu" side="bottom" align="start">
  Open Menu
</sng-button>

<sng-menu #menu>
  <sng-menu-label>My Account</sng-menu-label>
  <sng-menu-separator />
  <sng-menu-item>
    Profile
    <sng-menu-shortcut>Ctrl+P</sng-menu-shortcut>
  </sng-menu-item>
  <sng-menu-item>
    Settings
    <sng-menu-shortcut>Ctrl+,</sng-menu-shortcut>
  </sng-menu-item>
  <sng-menu-separator />
  <sng-menu-checkbox-item [(checked)]="showStatusBar">
    Show Status Bar
  </sng-menu-checkbox-item>
  <sng-menu-separator />
  <sng-menu-sub>
    <sng-menu-sub-trigger>Share</sng-menu-sub-trigger>
    <sng-menu-sub-content>
      <sng-menu-item>Email</sng-menu-item>
      <sng-menu-item>Twitter</sng-menu-item>
      <sng-menu-item>LinkedIn</sng-menu-item>
    </sng-menu-sub-content>
  </sng-menu-sub>
  <sng-menu-separator />
  <sng-menu-item>
    Logout
    <sng-menu-shortcut>Ctrl+Q</sng-menu-shortcut>
  </sng-menu-item>
</sng-menu>
```

## Context Menu Pattern

```html
<!-- Right-click context menu -->
<div class="w-full h-64 border rounded"
     [sngContextTrigger]="contextMenu">
  Right-click anywhere in this area
</div>

<sng-menu #contextMenu>
  <sng-menu-item>
    Cut
    <sng-menu-shortcut>Ctrl+X</sng-menu-shortcut>
  </sng-menu-item>
  <sng-menu-item>
    Copy
    <sng-menu-shortcut>Ctrl+C</sng-menu-shortcut>
  </sng-menu-item>
  <sng-menu-item>
    Paste
    <sng-menu-shortcut>Ctrl+V</sng-menu-shortcut>
  </sng-menu-item>
  <sng-menu-separator />
  <sng-menu-item>Select All</sng-menu-item>
  <sng-menu-separator />
  <sng-menu-item>Delete</sng-menu-item>
</sng-menu>
```

## Menubar Pattern

```html
<!-- Horizontal menubar with origin-based alignment -->
<nav class="flex items-center gap-1 p-1 border rounded" #menubarNav>
  <!-- File: start-aligned relative to full menubar via [origin] -->
  <button [sngMenuTrigger]="fileMenu"
          [origin]="menubarNav" align="start">File</button>
  <sng-menu #fileMenu>
    <sng-menu-item>New <sng-menu-shortcut>Ctrl+N</sng-menu-shortcut></sng-menu-item>
    <sng-menu-item>Open <sng-menu-shortcut>Ctrl+O</sng-menu-shortcut></sng-menu-item>
    <sng-menu-item>Save <sng-menu-shortcut>Ctrl+S</sng-menu-shortcut></sng-menu-item>
    <sng-menu-separator />
    <sng-menu-sub>
      <sng-menu-sub-trigger>Export</sng-menu-sub-trigger>
      <sng-menu-sub-content>
        <sng-menu-item>PDF</sng-menu-item>
        <sng-menu-item>PNG</sng-menu-item>
        <sng-menu-item>SVG</sng-menu-item>
      </sng-menu-sub-content>
    </sng-menu-sub>
    <sng-menu-separator />
    <sng-menu-item>Exit</sng-menu-item>
  </sng-menu>

  <!-- Edit: center-aligned on its own trigger -->
  <button [sngMenuTrigger]="editMenu" align="center">Edit</button>
  <sng-menu #editMenu>
    <sng-menu-item>Undo <sng-menu-shortcut>Ctrl+Z</sng-menu-shortcut></sng-menu-item>
    <sng-menu-item>Redo <sng-menu-shortcut>Ctrl+Y</sng-menu-shortcut></sng-menu-item>
    <sng-menu-separator />
    <sng-menu-item>Cut</sng-menu-item>
    <sng-menu-item>Copy</sng-menu-item>
    <sng-menu-item>Paste</sng-menu-item>
  </sng-menu>

  <!-- View: end-aligned relative to full menubar via [origin] -->
  <button [sngMenuTrigger]="viewMenu"
          [origin]="menubarNav" align="end">View</button>
  <sng-menu #viewMenu>
    <sng-menu-radio-group [(value)]="viewMode">
      <sng-menu-radio-item value="grid">Grid</sng-menu-radio-item>
      <sng-menu-radio-item value="list">List</sng-menu-radio-item>
    </sng-menu-radio-group>
  </sng-menu>
</nav>
```

## Overlay Behavior

### SngMenuTrigger (Click Trigger)

The click trigger uses CDK Overlay **without** a backdrop. Instead, it manages outside-click detection and scroll blocking manually:

- **No backdrop** (`hasBackdrop: false`) - triggers remain interactive while menu is open
- **Scroll is blocked** via wheel/touchmove event listeners on document (capture phase, `preventDefault`)
- **Clicking outside** closes via a `pointerdown` listener that checks if click target is outside both overlay and trigger
- **Reposition strategy** - menu repositions on scroll rather than closing

```typescript
// Overlay configuration used by SngMenuTrigger.open()
this.overlay.create({
  positionStrategy,
  scrollStrategy: this.overlay.scrollStrategies.reposition(),
  hasBackdrop: false,
  minWidth: triggerWidth,
});
```

### SngContextTrigger (Right-click Trigger)

The context trigger uses a **transparent backdrop**:

- **Has backdrop** (`hasBackdrop: true`, `cdk-overlay-transparent-backdrop`)
- **Close on scroll** strategy - backdrop covers viewport, clicking outside closes
- Opens at cursor position via `flexibleConnectedTo({ x, y })`

```typescript
// Overlay configuration used by SngContextTrigger
this.overlay.create({
  positionStrategy,
  scrollStrategy: this.overlay.scrollStrategies.close(),
  hasBackdrop: true,
  backdropClass: 'cdk-overlay-transparent-backdrop',
});
```

### Submenu Hover Behavior

- Submenus open on hover with a 100ms delay
- Switching between sibling submenus is instant (no delay) when another submenu is already open
- When mouse crosses the 4px gap between overlay panes, ancestor submenus cancel any pending close via `_keepAncestorChainOpen()`
- Cascade close: closing a submenu synchronously disposes all nested child overlays via `_contentDispose` callbacks

## Do's and Don'ts

### Do
- Style menubar triggers as ghost buttons in a flex container
- Use `[isCloseOnSelect]="false"` on checkbox/radio items to keep the menu open
- Use `sng-menu-shortcut` for focus hint display
- Group related items with `sng-menu-label` and `sng-menu-separator`
- Use `[origin]` input on menubar triggers for full-width alignment

### Don't
- Mix trigger types on the same element
- Use deep nesting (more than 3 levels) without good reason
- Add complex interactive content inside menu items
- Use `focus:` pseudo-class on menu items (use `focus-visible:` to avoid programmatic focus highlights)

## Common Mistakes

1. **Forgetting the menu reference**: The trigger needs `#menuRef` and `[sngMenuTrigger]="menuRef"`
2. **Wrong positioning**: Use `side` and `align` inputs on the trigger, not the menu
3. **Context menu on interactive elements**: Right-click triggers conflict with native browser context menus on buttons/links
4. **Using `focus:` instead of `focus-visible:`**: Menu items get programmatic focus when opened. Use `focus-visible:` so only focus-initiated focus shows a highlight.

## Accessibility Summary

- Core click-driven interaction with focus-visible styling
- Proper ARIA roles (`menu`, `menuitem`, `menuitemcheckbox`, `menuitemradio`)
- Focus management: first interactive item receives focus on open
- Type-ahead: typing a character jumps to the first matching item
- `focus-visible` styling ensures only focus users see focus indicators
