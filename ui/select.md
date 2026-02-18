
# ShadNG Select

Customizable dropdown selection component with Angular forms integration. Uses inline absolute positioning for predictable layout control and optional searchable mode with built-in filtering.

## Installation

```bash
npx @shadng/sng-ui add select
```

## Basic Usage

```html
<sng-select [(value)]="selectedLanguage" placeholder="Select a language">
  <sng-select-item value="english"><span class="mr-2">[EN]</span>English</sng-select-item>
  <sng-select-item value="spanish"><span class="mr-2">[ES]</span>Spanish</sng-select-item>
  <sng-select-item value="french"><span class="mr-2">[FR]</span>French</sng-select-item>
</sng-select>
```

## Grouped Options

```html
<sng-select placeholder="Select timezone" [(value)]="selectedTimezone">
  <sng-select-group>
    <sng-select-label>North America</sng-select-label>
    <sng-select-item value="est">Eastern Standard Time (EST)</sng-select-item>
    <sng-select-item value="cst">Central Standard Time (CST)</sng-select-item>
    <sng-select-item value="pst">Pacific Standard Time (PST)</sng-select-item>
  </sng-select-group>
  <sng-select-separator></sng-select-separator>
  <sng-select-group>
    <sng-select-label>Europe</sng-select-label>
    <sng-select-item value="gmt">Greenwich Mean Time (GMT)</sng-select-item>
    <sng-select-item value="cet">Central European Time (CET)</sng-select-item>
  </sng-select-group>
</sng-select>
```

## Form Integration

```html
<!-- Two-way binding with model() (Signal Forms compatible) -->
<sng-select [(value)]="selectedRole" placeholder="Select role">
  <sng-select-item value="admin">Admin</sng-select-item>
  <sng-select-item value="editor">Editor</sng-select-item>
</sng-select>
```


---

# Searchable Select

Add the `searchable` attribute to enable a built-in search input for filtering items. Uses the same `sng-select-item` components.

## Searchable Basic Usage

```html
<sng-select searchable [(value)]="selectedFramework" placeholder="Select framework..." searchPlaceholder="Search frameworks...">
  <sng-select-empty>No framework found.</sng-select-empty>
  <sng-select-group>
    <sng-select-item value="angular">Angular</sng-select-item>
    <sng-select-item value="react">React</sng-select-item>
    <sng-select-item value="vue">Vue</sng-select-item>
    <sng-select-item value="svelte">Svelte</sng-select-item>
    <sng-select-item value="solid">SolidJS</sng-select-item>
  </sng-select-group>
</sng-select>
```


---

# SngSelect Technical Reference

## Component Architecture

```typescript
// 8 components in compound pattern:
// 1. SngSelect          - Root container with trigger button, uses model() for two-way binding
// 2. SngSelectItem      - Selectable option, implements FocusableOption for CDK, auto-filters in searchable mode
// 3. SngSelectEmpty     - Empty state message shown when no items match search (searchable mode)
// 4. SngSelectContent   - Content wrapper directive with padding
// 5. SngSelectGroup     - Groups related items with role="group"
// 6. SngSelectLabel     - Label directive for group headers
// 7. SngSelectSeparator - Visual divider directive between items/groups
// 8. (searchable mode)  - Search input built into SngSelect template, no separate component needed
```

High-signal technical documentation for AI coding assistants. No marketing. TypeScript interfaces, edge cases.

## Component Interfaces

```typescript
// SngSelect - Root Container
interface SngSelectApi {
  // INPUTS (all via input())
  value: ModelSignal<string>;               // Two-way bindable selection
  placeholder: InputSignal<string>;         // Default: 'Select an option'
  disabled: InputSignal<boolean>;           // Default: false
  searchable: InputSignal<boolean>;         // Default: false - enables search input
  searchPlaceholder: InputSignal<string>;   // Default: 'Search...'
  class: InputSignal<string>;              // Default: ''

  // INTERNAL STATE
  isOpen: WritableSignal<boolean>;          // Dropdown visibility
  dropdownVisible: WritableSignal<boolean>; // Controls [hidden] on panel
  displayValue: Signal<string>;             // Current display text
  searchQuery: WritableSignal<string>;      // Current search filter (searchable mode)
  visibleItemCount: WritableSignal<number>; // Items matching search (searchable mode)

  // QUERIES
  items: Signal<readonly SngSelectItem[]>;

  // METHODS
  toggle(): void;
  open(): void;
  close(): void;
  _selectValue(value: string, displayText: string): void;
  _incrementVisibleCount(): void;
  _decrementVisibleCount(): void;
}

// SngSelectItem - Selectable Option
interface SngSelectItemApi {
  // INPUTS
  value: InputSignal<string>;       // REQUIRED - selection value
  isDisabled: InputSignal<boolean>; // Default: false
  class: InputSignal<string>;       // Default: ''

  // COMPUTED
  isSelected: Signal<boolean>;      // value() === parent.value()
  isVisible: Signal<boolean>;       // Always true unless searchable mode + query mismatch

  // METHODS
  focus(): void;                    // Programmatic focus helper
  onSelect(): void;                 // Trigger selection
  _getTextContent(): string;        // Get display text
}

// SngSelectEmpty - Empty State (searchable mode)
interface SngSelectEmptyApi {
  class: InputSignal<string>;       // Default: ''
  shouldHide: Signal<boolean>;      // Hidden when no query OR items match
}

// SngSelectContent - Content Wrapper (Directive)
interface SngSelectContentApi {
  class: InputSignal<string>;       // Default: ''
}

// SngSelectGroup - Group Container (Directive)
interface SngSelectGroupApi {
  class: InputSignal<string>;       // Default: ''
}

// SngSelectLabel - Group Label (Directive)
interface SngSelectLabelApi {
  class: InputSignal<string>;       // Default: ''
}

// SngSelectSeparator - Visual Divider (Directive)
interface SngSelectSeparatorApi {
  class: InputSignal<string>;       // Default: ''
}
```

## Interaction Contract

```typescript
@Component({
  selector: 'sng-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative block w-full',
    '(document:click)': 'onDocumentClick($event)',
  }
})
export class SngSelect {
  // Trigger and content interactions are click-driven.
  // Content: click selection with standard browser focus flow.
}
```

## Import Requirements

```typescript
// ALL COMPONENTS - only import what you need
import {
  SngSelect,
  SngSelectItem,
  SngSelectEmpty,       // For searchable empty state
  SngSelectContent,     // Optional: content wrapper
  SngSelectGroup,       // Optional: grouping
  SngSelectLabel,       // Optional: group labels
  SngSelectSeparator,   // Optional: visual dividers
} from 'sng-ui';

// MINIMUM REQUIRED (basic select)
import { SngSelect, SngSelectItem } from 'sng-ui';

// MINIMUM REQUIRED (searchable select)
import { SngSelect, SngSelectItem, SngSelectEmpty } from 'sng-ui';

@Component({
  standalone: true,
  imports: [SngSelect, SngSelectItem, SngSelectEmpty],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent { }
```

## Form Integration

```typescript
// Uses model() for Signal Forms compatible two-way binding
@Component({
  imports: [SngSelect, SngSelectItem],
  template: `
    <sng-select [(value)]="selectedRole" placeholder="Select role">
      <sng-select-item value="admin">Admin</sng-select-item>
      <sng-select-item value="editor">Editor</sng-select-item>
    </sng-select>
  `
})
export class MyComponent {
  selectedRole = signal('');
}
```

## ARIA Compliance (Automatic)

```html
<!-- Generated ARIA structure -->
<sng-select>
  <button
    type="button"
    role="combobox"
    aria-expanded="false"
    aria-haspopup="listbox"
  >
    <span>Select an option</span>
    <svg><!-- chevron icon --></svg>
  </button>

  <!-- When open -->
  <div role="listbox" data-state="open">
    <sng-select-item
      role="option"
      aria-selected="true"
      aria-disabled="false"
      tabindex="0"
      data-state="checked">
      Selected Option
    </sng-select-item>
    <sng-select-item
      role="option"
      aria-selected="false"
      aria-disabled="true"
      tabindex="-1"
      data-state="unchecked">
      Disabled Option
    </sng-select-item>
  </div>
</sng-select>
```

## Click Outside Handling

```typescript
// SngSelect uses a host-bound document click listener
// Clicks outside the component's element boundary close the dropdown:
onDocumentClick(event: MouseEvent) {
  if (!this.elementRef.nativeElement.contains(event.target)) {
    this.close();
  }
}
```

## Animation System

```typescript
// data-state attributes drive enter/exit CSS animations
// close() waits for exit animation via getAnimations() + Promise.all()

// CSS animations (inline in component styles):
// .sng-select-content[data-state=open] { animation: sng-select-enter 150ms ease both; }
// .sng-select-content[data-state=closed] { animation: sng-select-exit 150ms ease both; }
```

## Edge Cases & Constraints

```typescript
// 1. VALUE CASE SENSITIVITY
"Apple" !== "apple" !== "APPLE"  // Different values

// 2. DISPLAY VALUE SYNC
// Effect automatically syncs display text when value changes
effect(() => {
  const currentValue = this.value();
  const allItems = this.items();
  const selectedItem = allItems.find(item => item.value() === currentValue);
  if (selectedItem) {
    this.displayValue.set(selectedItem._getTextContent());
  }
});

// 3. DISABLED STATE
// disabled input controls interaction
// disabled = input(false, { transform: booleanAttribute });

// 4. ITEM TEXT EXTRACTION
// Uses textContent, strips whitespace
_getTextContent(): string {
  return this.elementRef.nativeElement.textContent?.trim() || '';
}

// 5. FOCUS MANAGEMENT
// Searchable: search input receives focus when opened.
// Non-searchable: trigger retains predictable focus flow.
```

## Searchable Mode Behavior

```typescript
// SngSelectItem auto-filters based on text content when parent is searchable
isVisible = computed(() => {
  if (!this.parentSelect.searchable()) return true;
  const query = this.parentSelect.searchQuery().toLowerCase();
  if (!query) return true;
  const text = this._getTextContent().toLowerCase();
  return text.includes(query);
});

// Host classes include hidden when not visible
hostClasses = computed(() => cn(
  'relative flex w-full cursor-pointer select-none items-center',
  'rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none',
  'hover:bg-accent hover:text-accent-foreground',
  'focus-visible:bg-accent focus-visible:text-accent-foreground',
  this.isDisabled() && 'pointer-events-none opacity-50',
  !this.isVisible() && 'hidden',
  this.class()
));

// SngSelectEmpty shows when search query exists AND no items match
shouldHide = computed(() => {
  const query = this.select?.searchQuery() ?? '';
  const visibleCount = this.select?.visibleItemCount() ?? 0;
  return !query || visibleCount > 0;
});

// Search query resets when dropdown opens and on close
open() {
  if (this.searchable()) this.searchQuery.set('');
  this.dropdownVisible.set(true);
  this.isOpen.set(true);
}
```

## Component Composition

```typescript
// Basic select with content projection
<sng-select [(value)]="selectedLanguage" placeholder="Select a language">
  <sng-select-item value="english"><span class="mr-2">[EN]</span>English</sng-select-item>
  <sng-select-item value="french"><span class="mr-2">[FR]</span>French</sng-select-item>
</sng-select>

// With groups and separators
<sng-select [(value)]="selected">
  <sng-select-group>
    <sng-select-label>Category A</sng-select-label>
    <sng-select-item value="a1">Item A1</sng-select-item>
    <sng-select-item value="a2">Item A2</sng-select-item>
  </sng-select-group>
  <sng-select-separator></sng-select-separator>
  <sng-select-group>
    <sng-select-label>Category B</sng-select-label>
    <sng-select-item value="b1">Item B1</sng-select-item>
  </sng-select-group>
</sng-select>

// Searchable select
<sng-select searchable [(value)]="selectedFramework" placeholder="Select framework..." searchPlaceholder="Search frameworks...">
  <sng-select-empty>No framework found.</sng-select-empty>
  <sng-select-group>
    <sng-select-item value="angular">Angular</sng-select-item>
    <sng-select-item value="react">React</sng-select-item>
    <sng-select-item value="vue">Vue</sng-select-item>
    <sng-select-item value="svelte">Svelte</sng-select-item>
    <sng-select-item value="solid">SolidJS</sng-select-item>
  </sng-select-group>
</sng-select>

// All selectors use element syntax
<sng-select-group>      // Element selector
<sng-select-label>      // Element selector
<sng-select-separator>  // Element selector
<sng-select-empty>      // Element selector
```

## Do's and Don'ts

### Do
- Use `[(value)]` for two-way binding with signals
- Use `searchable` attribute for lists with 10+ options where search provides value
- Use `sng-select-empty` to show feedback when filtering returns no results
- Keep option lists under 15 items for basic select - use `searchable` for more
- Group related options with `sng-select-group` and `sng-select-label`
- Add context to disabled options: "Enterprise (Contact Sales)"
- Test focus flow, enter/space activation, and escape close
- Use descriptive placeholders: "Choose your country" not "Select"

### Don't
- Use separate combobox components - use `sng-select searchable` instead
- Disable options without explanation
- Forget to import `SngSelectItem` - won't render properly
- Mix element and attribute selectors for directives
- Assume `value` is case-insensitive - it's exact match
- Forget empty state in searchable mode - blank dropdown is confusing
- Forget to import component modules in your standalone component

## Common Mistakes

1. **Missing component imports** - Ensure all needed select components are imported in your standalone component's `imports` array.

2. **Using wrong selectors for directives** - Group, Label, Separator are directives with element selectors. Use `<sng-select-group>` not `<div sng-select-group>`.

3. **Value type mismatch** - value is always string. Convert numbers: `value="1"` not `[value]="1"`.

4. **Display value not updating** - Items queried via `contentChildren` with descendants. Ensure items are in template, not dynamically added.

5. **Disabled state not applied** - Check that the `disabled` input is set on the `sng-select` component.

6. **Click outside not working** - The component uses a document click listener bound via `(document:click)` on the host.

7. **Using npm install** - Use `npx @shadng/sng-ui add select` (copy-paste model, not npm dependency).

8. **Forgetting empty state in searchable mode** - When search returns no results, users see blank dropdown. Always include `sng-select-empty`.

9. **Using `disabled` instead of `isDisabled` on items** - The item input is named `isDisabled`, not `disabled`.

## Accessibility Summary

### Automatic ARIA (no configuration needed)
- `role="combobox"` on trigger button
- `role="listbox"` on dropdown content
- `role="option"` on each item
- `aria-expanded` reflects open state
- `aria-haspopup="listbox"` on trigger
- `aria-selected` on items
- `aria-disabled` on disabled items
- `tabindex` management (0 or -1)


### Focus Management
- Non-searchable: trigger keeps focus on open
- Searchable: search input focused on open
- Focus returns to trigger on close
