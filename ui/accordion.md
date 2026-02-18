
# ShadNG Accordion

Collapsible content sections built on Angular CDK. Single or multiple expansion modes, WAI-ARIA compliant.

## Installation

```bash
npx @shadng/sng-ui add accordion
```

## Basic Usage

```html
<sng-accordion type="single" [collapsible]="true" defaultValue="item-1">
  <sng-accordion-item value="item-1">
    <sng-accordion-trigger>Section Title</sng-accordion-trigger>
    <sng-accordion-content>Section content here.</sng-accordion-content>
  </sng-accordion-item>
  <sng-accordion-item value="item-2">
    <sng-accordion-trigger>Another Section</sng-accordion-trigger>
    <sng-accordion-content>More content here.</sng-accordion-content>
  </sng-accordion-item>
</sng-accordion>
```

## Multiple Mode

```html
<sng-accordion type="multiple" [defaultValue]="['section-1', 'section-3']">
  <sng-accordion-item value="section-1">
    <sng-accordion-trigger>First</sng-accordion-trigger>
    <sng-accordion-content>Content 1</sng-accordion-content>
  </sng-accordion-item>
  <sng-accordion-item value="section-2">
    <sng-accordion-trigger>Second</sng-accordion-trigger>
    <sng-accordion-content>Content 2</sng-accordion-content>
  </sng-accordion-item>
  <sng-accordion-item value="section-3">
    <sng-accordion-trigger>Third</sng-accordion-trigger>
    <sng-accordion-content>Content 3</sng-accordion-content>
  </sng-accordion-item>
</sng-accordion>
```

## Controlled State

```typescript
// Component class
activeSection = signal<string>('');

// Template
<button (click)="activeSection.set('billing')">Open Billing</button>
<button (click)="activeSection.set('')">Close All</button>

<sng-accordion type="single" [collapsible]="true" [(defaultValue)]="activeSection">
  <sng-accordion-item value="billing">...</sng-accordion-item>
  <sng-accordion-item value="shipping">...</sng-accordion-item>
</sng-accordion>
```

## Disabled Accordion

```html
<!-- Disable entire accordion -->
<sng-accordion [disabled]="isLoading()" type="single">
  <sng-accordion-item value="item-1">...</sng-accordion-item>
  <sng-accordion-item value="item-2">...</sng-accordion-item>
</sng-accordion>

<!-- Disable individual item -->
<sng-accordion type="single">
  <sng-accordion-item value="active">...</sng-accordion-item>
  <sng-accordion-item value="disabled" [disabled]="true">...</sng-accordion-item>
</sng-accordion>
```

## Horizontal Variant

Use `layout="horizontal"` for a side-by-side panel layout. Collapsed panels show vertical text, and clicking expands a panel to reveal its content.

```html
<sng-accordion layout="horizontal" class="h-[200px] border rounded-lg">
  <sng-accordion-item value="panel-1">
    <sng-accordion-trigger>Panel 1</sng-accordion-trigger>
    <sng-accordion-content>
      First panel content. Click another panel to switch.
    </sng-accordion-content>
  </sng-accordion-item>
  <sng-accordion-item value="panel-2">
    <sng-accordion-trigger>Panel 2</sng-accordion-trigger>
    <sng-accordion-content>
      Second panel content with detailed information.
    </sng-accordion-content>
  </sng-accordion-item>
  <sng-accordion-item value="panel-3">
    <sng-accordion-trigger>Panel 3</sng-accordion-trigger>
    <sng-accordion-content>
      Third panel with detailed information.
    </sng-accordion-content>
  </sng-accordion-item>
</sng-accordion>
```

**Note:** Horizontal layout requires a fixed height (e.g., `class="h-[200px]"`) on the accordion container.

## Orientation

The `orientation` prop controls semantic orientation metadata. It's auto-inferred from `layout` but can be overridden.

```html
<!-- Vertical layout with explicit orientation override -->
<sng-accordion layout="vertical" orientation="horizontal" type="single">
  <sng-accordion-item value="tab-1">
    <sng-accordion-trigger>Tab 1</sng-accordion-trigger>
    <sng-accordion-content>Panel 1</sng-accordion-content>
  </sng-accordion-item>
  <sng-accordion-item value="tab-2">
    <sng-accordion-trigger>Tab 2</sng-accordion-trigger>
    <sng-accordion-content>Panel 2</sng-accordion-content>
  </sng-accordion-item>
</sng-accordion>
```

---

# SngAccordion Technical Reference

High-signal technical documentation for AI coding assistants. No marketing. TypeScript interfaces, CDK primitives, edge cases.

## Component Architecture

```typescript
// 4 components in compound pattern:
// 1. SngAccordion         - Root container, state manager, CDK Accordion host
// 2. SngAccordionItem     - Item wrapper with value, CDK AccordionItem host
// 3. SngAccordionTrigger  - Clickable header with activation semantics
// 4. SngAccordionContent  - Collapsible content with CSS Grid animation
```

## Component Interfaces

```typescript
// SngAccordion - Root Container
interface SngAccordionApi {
  // INPUTS (all via input())
  type: InputSignal<'single' | 'multiple'>;           // Default: 'single'
  collapsible: InputSignal<boolean>;                   // Default: true
  disabled: InputSignal<boolean>;                      // Default: false
  layout: InputSignal<'vertical' | 'horizontal'>;     // Default: 'vertical' - visual layout
  orientation: InputSignal<'vertical' | 'horizontal'>; // Default: 'vertical' - orientation semantics (auto-inferred from layout)
  defaultValue: ModelSignal<string | string[]>;        // Two-way bindable

  // QUERIES
  items: Signal<readonly SngAccordionItem[]>;

  // METHODS
  toggle(value: string): void;
  isExpanded(value: string): boolean;
  focusNextTrigger(currentValue: string): void;
  focusPrevTrigger(currentValue: string): void;
  focusFirstTrigger(): void;
  focusLastTrigger(): void;
}

// SngAccordionItem - Item Container
interface SngAccordionItemApi {
  // INPUTS
  value: InputSignal<string>;       // REQUIRED
  disabled: InputSignal<boolean>;   // Default: false
  class: InputSignal<string>;       // Default: ''

  // COMPUTED
  isDisabled: Signal<boolean>;      // item.disabled() || accordion.disabled()
  isExpanded: Signal<boolean>;      // Derived from parent

  // ARIA IDs (auto-generated)
  triggerId: string;  // e.g., "sng-accordion-a1b2c3d-trigger"
  contentId: string;  // e.g., "sng-accordion-a1b2c3d-content"

  // METHODS
  toggle(): void;
  focusTrigger(): void;

  // CDK OUTPUTS
  opened: EventEmitter<void>;
  closed: EventEmitter<void>;
}

// SngAccordionTrigger - Clickable Header
interface SngAccordionTriggerApi {
  class: InputSignal<string>;
  isExpanded: () => boolean;
  focus(): void;
}

// SngAccordionContent - Collapsible Content Area
interface SngAccordionContentApi {
  class: InputSignal<string>;
  isExpanded: Signal<boolean>;
  state: Signal<'open' | 'closed'>;
}
```

### TypeScript Types

```typescript
/** Expansion behavior mode */
type SngAccordionType = 'single' | 'multiple';

/** Visual layout direction */
type SngAccordionLayout = 'vertical' | 'horizontal';

/** Orientation metadata */
type SngAccordionOrientation = 'vertical' | 'horizontal';

/** Value type for expansion state */
type SngAccordionValue = string | string[];

/** Data-state attribute values */
type SngAccordionState = 'open' | 'closed';
```

## Angular CDK Integration

```typescript
// SngAccordion uses CdkAccordion as hostDirective
@Component({
  selector: 'sng-accordion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{
    directive: CdkAccordion,
    inputs: ['multi']  // Maps to type input internally
  }],
  host: {
    '[class]': 'hostClasses()',  // 'w-full' + flex for horizontal
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-layout]': 'layout()',
    '[attr.data-disabled]': 'disabled() || null',
  }
})
export class SngAccordion implements SngAccordionApi { }

// SngAccordionItem uses CdkAccordionItem as hostDirective
@Component({
  selector: 'sng-accordion-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{
    directive: CdkAccordionItem,
    inputs: ['disabled'],
    outputs: ['opened', 'closed']
  }],
  host: {
    '[attr.data-state]': 'isExpanded() ? "open" : "closed"',
  }
})
export class SngAccordionItem implements SngAccordionItemApi { }

// CDK Provides:
// - Multi-expansion state management
// - Disabled state handling
// - opened/closed event emission
// - Expansion state synchronization
```

## Import Requirements

```typescript
// ALL 4 COMPONENTS REQUIRED
import {
  SngAccordion,
  SngAccordionItem,
  SngAccordionTrigger,
  SngAccordionContent
} from 'sng-ui';

// Types (optional, for strict typing)
import type {
  SngAccordionType,
  SngAccordionOrientation,
  SngAccordionValue,
  SngAccordionState,
  SngAccordionApi,
  SngAccordionItemApi,
} from 'sng-ui';

@Component({
  standalone: true,
  imports: [
    SngAccordion,
    SngAccordionItem,
    SngAccordionTrigger,
    SngAccordionContent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent { }
```

## Animation System

```typescript
// CSS Grid animation - no JavaScript height calculation
// SngAccordionContent host bindings:
host: {
  '[style.display]': '"grid"',
  '[style.grid-template-rows]': 'isExpanded() ? "1fr" : "0fr"',
  '[style.transition]': '"grid-template-rows 200ms ease-out"',
}

// Inner wrapper clips content during animation
template: `
  <div class="overflow-hidden min-h-0">
    <div [class]="innerClasses()">
      <ng-content />
    </div>
  </div>
`

// Data-state attributes for animation targeting
// Available on item and content elements:
// [data-state]="open" | "closed"
// Accordion uses CSS transitions for height animation (not @keyframes)
```

## ARIA Compliance (Automatic)

```html
<!-- Generated ARIA structure -->
<sng-accordion-item data-state="open">
  <h3>
    <sng-accordion-trigger
      role="button"
      id="sng-accordion-a1b2c3d-trigger"
      aria-expanded="true"
      aria-controls="sng-accordion-a1b2c3d-content"
      tabindex="0"
      data-orientation="vertical">
      Trigger Text
    </sng-accordion-trigger>
  </h3>
  <sng-accordion-content
    role="region"
    id="sng-accordion-a1b2c3d-content"
    aria-labelledby="sng-accordion-a1b2c3d-trigger"
    data-state="open">
    Content
  </sng-accordion-content>
</sng-accordion-item>

<!-- Disabled state attributes -->
<sng-accordion-trigger
  aria-disabled="true"
  tabindex="-1">
</sng-accordion-trigger>
```

## CDK Events

```html
<!-- opened/closed events from CdkAccordionItem hostDirective -->
<sng-accordion-item
  value="analytics"
  (opened)="trackOpen('analytics')"
  (closed)="trackClose('analytics')">
  <sng-accordion-trigger>Analytics Section</sng-accordion-trigger>
  <sng-accordion-content>...</sng-accordion-content>
</sng-accordion-item>
```

## Expansion Mode Behavior

```typescript
// SINGLE MODE (default)
// - Only one item open at a time
// - Opening new item closes current
// - collapsible=true: can close all
// - collapsible=false: one must stay open

type="single" [collapsible]="true"   // FAQ pattern
type="single" [collapsible]="false"  // Wizard pattern

// MULTIPLE MODE
// - Any number of items open simultaneously
// - collapsible input IGNORED (always collapsible)

type="multiple"  // Settings panel pattern
```

## Disabled State Cascade

```typescript
// Effective disabled state = item.disabled() || accordion.disabled()
// When accordion.disabled=true, ALL items are disabled

// SngAccordionItem computed:
isDisabled = computed(() => this.disabled() || this.accordion.disabled());

// Used for:
// - Preventing toggle on click
// - Setting tabindex=-1
// - Setting aria-disabled="true"
// - Adding pointer-events-none opacity-50 classes
// - Skipping during trigger focus flow
```

## Variant vs Orientation

```typescript
// VARIANT - Controls visual layout
layout="vertical"    // Default: Items stacked, height animates
layout="horizontal"  // Items side-by-side, width animates, vertical text when collapsed

// ORIENTATION - Controls semantic orientation metadata (auto-inferred from layout)
orientation="vertical"    // semantic vertical orientation
orientation="horizontal"  // semantic horizontal orientation

// Horizontal layout auto-sets orientation="horizontal"
// Override if needed: layout="horizontal" orientation="vertical"
```

### Horizontal Variant Details

```typescript
// Horizontal accordion requirements:
// 1. Fixed height on container: class="h-[200px]"
// 2. Collapsed panels show vertical text with writing-mode: vertical-lr
// 3. Expanded panel takes flex-1, collapsed panels are flex-none w-16
// 4. Last expanded panel has no right border (overlaps accordion border)

<sng-accordion layout="horizontal" class="h-[320px] border rounded-lg">
  ...
</sng-accordion>
```

## Edge Cases & Constraints

```typescript
// 1. VALUE CASE SENSITIVITY
"Item-1" !== "item-1" !== "ITEM-1"  // Different values

// 2. COLLAPSIBLE IGNORED IN MULTIPLE MODE
type="multiple" [collapsible]="false"  // collapsible has no effect

// 3. EMPTY DEFAULT VALUE
defaultValue=""       // Single: nothing open
[defaultValue]="[]"   // Multiple: nothing open

// 4. DYNAMIC TYPE CHANGE - NOT RECOMMENDED
// Changing type clears expansion state
// If needed, also update defaultValue format

// 5. CONTENT CHILDREN QUERY
// Uses { descendants: true } for nested accordions
items = contentChildren(SngAccordionItem, { descendants: true });

// 6. SSR ID SAFETY
// IDs use random string, not counter
// Prevents server/client mismatch
private id = `sng-accordion-${Math.random().toString(36).substring(2, 9)}`;

// 7. DISABLED ACCORDION KEYBOARD NAV
// All triggers get tabindex=-1
// enabledItems() returns empty array
// focusNextTrigger/etc do nothing
```

## Semantic Value Naming

```typescript
// CORRECT - Semantic identifiers
value="shipping"
value="privacy-settings"
value="billing-info"

// AVOID - Positional identifiers
value="item-1"
value="section-2"
value="panel-3"
```

## Use Case Selection

```typescript
// ACCORDION APPROPRIATE
// - 3-10 collapsible sections
// - Long content needs hiding
// - Users need to focus on one section

// USE TABS INSTEAD
// - < 3 sections
// - Short content
// - Need visible section headers always

// USE NAVIGATION INSTEAD
// - > 10 sections
// - > 2 nesting levels
// - Different page destinations
```

## Do's and Don'ts

### Do
- Use `type="multiple"` for settings panels where users compare sections
- Add `[collapsible]="true"` for FAQs so users can close everything
- Use `[disabled]="true"` on accordion root to disable all at once during loading
- Use `layout="horizontal"` for comparison views (e.g., service dashboards, feature comparison)
- Set fixed height on horizontal accordion container: `class="h-[200px]"`
- Use semantic value names: `"shipping"` not `"item-1"`
- Keep trigger text short and scannable (3-5 words)
- Use CDK events `(opened)`/`(closed)` for analytics
- Test focus and activation behavior in both layouts

### Don't
- Nest more than 2 levels deep - use navigation instead
- Put forms in single mode - users lose unsaved data when switching
- Use accordion for just 2 items - use a toggle instead
- Put critical info in collapsed sections - users might miss it
- Change `type` dynamically - clears expansion state
- Forget to test disabled state accessibility
- Use positional value names like `"item-1"`
- Use horizontal layout without fixed height - content will overflow
- Use horizontal layout for more than 4-5 items - text becomes unreadable

## Common Mistakes

1. **collapsible ignored in multiple mode** - `collapsible` only affects `type="single"`. Multiple mode is always collapsible.

2. **Values are case-sensitive** - `"Item-1"` !== `"item-1"` !== `" item-1"` (note leading space)

3. **Missing component imports** - Need all 4: `SngAccordion`, `SngAccordionItem`, `SngAccordionTrigger`, `SngAccordionContent`

4. **Using npm install** - Use `npx @shadng/sng-ui add accordion` (copy-paste model, not npm dependency)

5. **Nested accordion inherits parent** - Wrong. Each nested accordion is independent with separate state.

6. **Forgetting isDisabled vs disabled** - `disabled()` is item's explicit input. `isDisabled()` combines item + parent accordion disabled state.

7. **Confusing layout and orientation** - `layout` controls visual layout (vertical/horizontal). `orientation` controls semantic orientation metadata. Orientation is auto-inferred from layout but can be overridden.

8. **Dynamic type without value update** - Switching type="single" to type="multiple" requires updating defaultValue from string to string[].

9. **Horizontal layout without fixed height** - `layout="horizontal"` requires a fixed height on the container (e.g., `class="h-[200px]"`). Without it, the accordion will collapse to zero height.

10. **Too many horizontal panels** - Horizontal layout works best with 3-5 items. More than that makes the vertical text labels hard to read.

## Accessibility Summary

### Automatic ARIA (no configuration needed)
- `role="button"` on trigger
- `role="region"` on content
- `aria-expanded` reflects state
- `aria-controls` links trigger to content
- `aria-labelledby` links content to trigger
- `aria-disabled` on disabled triggers
- `tabindex` management (0 or -1)
- `data-orientation` for CSS styling

### Focus Interaction
- Click toggles the selected item


- Tab: standard focus order
- Disabled items skipped automatically

### Focus Management
- `focusNextTrigger()` / `focusPrevTrigger()` skip disabled
- `focusFirstTrigger()` / `focusLastTrigger()` skip disabled
- Focus trapped within enabled items only
