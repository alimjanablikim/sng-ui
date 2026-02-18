
# ShadNG Tabs

Organize content into switchable panels. Built with Angular signals for state management. WAI-ARIA compliant.

## Installation

```bash
npx @shadng/sng-ui add tabs
```

## Basic Usage

```html
<sng-tabs defaultValue="account">
  <sng-tabs-list>
    <sng-tabs-trigger value="account">Account</sng-tabs-trigger>
    <sng-tabs-trigger value="password">Password</sng-tabs-trigger>
  </sng-tabs-list>
  <sng-tabs-content value="account">Account settings here.</sng-tabs-content>
  <sng-tabs-content value="password">Password settings here.</sng-tabs-content>
</sng-tabs>
```

## With Cards

```html
<sng-tabs defaultValue="account">
  <sng-tabs-list>
    <sng-tabs-trigger value="account">Account</sng-tabs-trigger>
    <sng-tabs-trigger value="password">Password</sng-tabs-trigger>
  </sng-tabs-list>
  <sng-tabs-content value="account">
    <sng-card>
      <sng-card-header>
        <sng-card-title>Account</sng-card-title>
        <sng-card-description>Make changes to your account here.</sng-card-description>
      </sng-card-header>
      <sng-card-content>
        <sng-input placeholder="Name" />
      </sng-card-content>
      <sng-card-footer>
        <sng-button>Save changes</sng-button>
      </sng-card-footer>
    </sng-card>
  </sng-tabs-content>
</sng-tabs>
```

## Multiple Tabs

```html
<sng-tabs defaultValue="overview">
  <sng-tabs-list>
    <sng-tabs-trigger value="overview">Overview</sng-tabs-trigger>
    <sng-tabs-trigger value="analytics">Analytics</sng-tabs-trigger>
    <sng-tabs-trigger value="reports">Reports</sng-tabs-trigger>
    <sng-tabs-trigger value="notifications">Notifications</sng-tabs-trigger>
  </sng-tabs-list>
  <sng-tabs-content value="overview">Overview content.</sng-tabs-content>
  <sng-tabs-content value="analytics">Analytics content.</sng-tabs-content>
  <sng-tabs-content value="reports">Reports content.</sng-tabs-content>
  <sng-tabs-content value="notifications">Notifications content.</sng-tabs-content>
</sng-tabs>
```


---

# SngTabs Technical Reference

## Component Architecture

```typescript
// 4 components in compound pattern:
// 1. SngTabs        - Root container, manages selection state via signals
// 2. SngTabsList    - Tab buttons container with role="tablist"
// 3. SngTabsTrigger - Clickable tab button with role="tab"
// 4. SngTabsContent - Panel content with role="tabpanel"
```

High-signal technical documentation for AI coding assistants. No marketing. TypeScript interfaces, injection tokens, edge cases.

## Component Interfaces

```typescript
// SngTabs - Root Container
interface SngTabsApi {
  // INPUTS (all via input())
  defaultValue: InputSignal<string>;   // Default: ''
  class: InputSignal<string>;          // Default: ''

  // INTERNAL STATE
  selectedValue: Signal<string>;       // Computed from _selectedValue or defaultValue

  // METHODS
  select(value: string): void;
  isSelected(value: string): boolean;
}

// SngTabsList - Trigger Container
interface SngTabsListApi {
  // INPUTS
  class: InputSignal<string>;          // Default: ''

  // INJECTS
  tabs: SngTabs;                       // Via SNG_TABS token
}

// SngTabsTrigger - Clickable Tab Button
interface SngTabsTriggerApi {
  // INPUTS
  value: InputSignal<string>;          // REQUIRED
  class: InputSignal<string>;          // Default: ''

  // COMPUTED
  isSelected: Signal<boolean>;         // Derived from parent

  // HOST LISTENER
  onClick(): void;                     // Calls tabs.select(value)
}

// SngTabsContent - Panel Content
interface SngTabsContentApi {
  // INPUTS
  value: InputSignal<string>;          // REQUIRED
  class: InputSignal<string>;          // Default: ''

  // COMPUTED
  isSelected: Signal<boolean>;         // Derived from parent
}
```

## Injection Token Pattern

```typescript
// Token definition in sng-tabs.ts
export const SNG_TABS = new InjectionToken<SngTabs>('SNG_TABS');

// Provider in SngTabs component
@Component({
  selector: 'sng-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: SNG_TABS, useExisting: SngTabs }],
  host: {
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngTabs {
  defaultValue = input<string>('');
  class = input<string>('');
  valueChange = output<string>();

  private _selectedValue = signal<string | null>(null);
  selectedValue = computed(() => this._selectedValue() ?? this.defaultValue());

  hostClasses = computed(() => cn('flex flex-col gap-1', this.class()));

  select(value: string) {
    this._selectedValue.set(value);
    this.valueChange.emit(value);
  }

  isSelected(value: string): boolean {
    return this.selectedValue() === value;
  }
}

// Child components inject the token
export class SngTabsTrigger {
  private tabs = inject(SNG_TABS);
  // Access: this.tabs.select(), this.tabs.isSelected()
}
```

## Import Requirements

```typescript
// ALL 4 COMPONENTS REQUIRED
import {
  SngTabs,
  SngTabsList,
  SngTabsTrigger,
  SngTabsContent
} from 'sng-ui';

@Component({
  standalone: true,
  imports: [
    SngTabs,
    SngTabsList,
    SngTabsTrigger,
    SngTabsContent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent { }
```

## Host Bindings and Styling

```typescript
// SngTabsList host
host: {
  'role': 'tablist',
  '[class]': 'hostClasses()',
}
hostClasses = computed(() =>
  cn(
    'inline-flex items-center justify-center bg-muted rounded-lg p-1',
    this.class()
  )
);

// SngTabsTrigger host
host: {
  'role': 'tab',
  '[class]': 'hostClasses()',
  '[attr.data-state]': 'isSelected() ? "active" : "inactive"',
  '[attr.data-value]': 'value()',
  '[attr.id]': 'triggerId()',
  '[attr.aria-controls]': 'contentId()',
  '[attr.tabindex]': '0',
  '[attr.aria-selected]': 'isSelected()',
}
hostClasses = computed(() => {
  const selected = this.isSelected();
  return cn(
    'inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-colors',
    'focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
    'rounded-md',
    selected
      ? 'bg-background text-foreground shadow-sm'
      : 'text-muted-foreground hover:text-foreground',
    this.class()
  );
});

// SngTabsContent host
host: {
  'role': 'tabpanel',
  '[class]': 'hostClasses()',
  '[attr.id]': 'contentId()',
  '[attr.aria-labelledby]': 'triggerId()',
  '[attr.data-state]': 'isSelected() ? "active" : "inactive"',
  '[hidden]': '!isSelected()',
}
hostClasses = computed(() =>
  cn('flex-1 outline-none', this.class())
);
```

## ARIA Compliance (Automatic)

```html
<!-- Generated ARIA structure -->
<sng-tabs>
  <sng-tabs-list role="tablist">
    <sng-tabs-trigger
      role="tab"
      id="sng-tabs-1-trigger-account"
      aria-controls="sng-tabs-1-content-account"
      aria-selected="true"
      tabindex="0"
      data-state="active"
      data-value="account">
      Account
    </sng-tabs-trigger>
    <sng-tabs-trigger
      role="tab"
      id="sng-tabs-1-trigger-password"
      aria-controls="sng-tabs-1-content-password"
      aria-selected="false"
      tabindex="0"
      data-state="inactive"
      data-value="password">
      Password
    </sng-tabs-trigger>
  </sng-tabs-list>
  <sng-tabs-content
    role="tabpanel"
    id="sng-tabs-1-content-account"
    aria-labelledby="sng-tabs-1-trigger-account"
    data-state="active">
    Content
  </sng-tabs-content>
  <sng-tabs-content
    role="tabpanel"
    id="sng-tabs-1-content-password"
    aria-labelledby="sng-tabs-1-trigger-password"
    data-state="inactive"
    hidden>
    Hidden content
  </sng-tabs-content>
</sng-tabs>
```

## State Management

```typescript
// Selection flow:
// 1. User clicks trigger
// 2. Host (click) binding calls tabs.select(value)
// 3. _selectedValue signal updates
// 4. selectedValue computed updates
// 5. All isSelected() computeds re-evaluate
// 6. Content [hidden] bindings update

// Initial state:
// - If defaultValue provided, that tab is selected
// - If no defaultValue, first click sets selection
// - _selectedValue starts as null, falls back to defaultValue

// Content visibility:
// - Uses native [hidden] attribute
// - Content stays in DOM (not destroyed)
// - Form state preserved when switching tabs
```

## Edge Cases & Constraints

```typescript
// 1. VALUE CASE SENSITIVITY
"Account" !== "account" !== "ACCOUNT"  // Different values

// 2. NO DEFAULT VALUE
defaultValue=""  // Nothing selected until user clicks

// 3. MISMATCHED VALUES
// If trigger value doesn't match any content value,
// clicking that trigger shows nothing
<sng-tabs-trigger value="account">Account</sng-tabs-trigger>
<sng-tabs-content value="accounts">...</sng-tabs-content>  // WRONG - different values

// 4. DUPLICATE VALUES
// If multiple triggers have same value, all highlight together
// If multiple contents have same value, all show/hide together

// 5. CONTENT PERSISTENCE
// Content is hidden with [hidden], NOT destroyed
// Form inputs preserve values when switching tabs
// Use @if for lazy loading (destroys content)

// 6. NO ANIMATION BY DEFAULT
// Add CSS transitions to sng-tabs-content for animations
// data-state="active"/"inactive" available for styling
```

## Custom Styling Patterns

```typescript
// Vertical tabs layout
<sng-tabs class="flex-row">
  <sng-tabs-list class="flex-col border-b-0 border-r">
    <sng-tabs-trigger value="a">Tab A</sng-tabs-trigger>
    <sng-tabs-trigger value="b">Tab B</sng-tabs-trigger>
  </sng-tabs-list>
  <sng-tabs-content value="a" class="pl-4">Content A</sng-tabs-content>
  <sng-tabs-content value="b" class="pl-4">Content B</sng-tabs-content>
</sng-tabs>

// Pills style (background instead of underline)
<sng-tabs-list class="border-b-0 bg-muted rounded-lg p-1">
  <sng-tabs-trigger
    value="a"
    class="border-b-0 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md px-3 py-1.5">
    Tab A
  </sng-tabs-trigger>
</sng-tabs-list>

// Full-width tabs
<sng-tabs-list class="w-full">
  <sng-tabs-trigger value="a" class="flex-1">Tab A</sng-tabs-trigger>
  <sng-tabs-trigger value="b" class="flex-1">Tab B</sng-tabs-trigger>
</sng-tabs-list>
```

## Do's and Don'ts

### Do
- Use semantic `value` names: `"account"` not `"tab-1"`
- Keep tab labels short (1-3 words)
- Use `defaultValue` to pre-select a tab
- Match `value` exactly between triggers and content
- Use `class` input for custom styling
- Test focus flow and activation states

### Don't
- Use different cases for same logical tab: `"Account"` vs `"account"`
- Put too many tabs (5-7 max before considering alternatives)
- Forget to import all 4 components
- Use `@if` on content unless you want lazy loading (destroys form state)
- Hardcode colors - use theme variables
- Nest tabs deeply - consider navigation instead

## Common Mistakes

1. **Value mismatch** - `value="account"` on trigger but `value="accounts"` on content. Must be exact match.

2. **Missing component imports** - Need all 4: `SngTabs`, `SngTabsList`, `SngTabsTrigger`, `SngTabsContent`

3. **Using npm install** - Use `npx @shadng/sng-ui add tabs` (copy-paste model)

4. **Form data loss expectations** - Content is hidden, not destroyed. Data persists. Use `@if` for lazy loading.

5. **Wrong case sensitivity** - Values are case-sensitive. `"Account"` !== `"account"`.

6. **No default selection** - Without `defaultValue`, nothing shows until user clicks.

## Accessibility Summary

### Automatic ARIA (no configuration needed)
- `role="tablist"` on list
- `role="tab"` on triggers
- `role="tabpanel"` on content
- `data-state` reflects active/inactive
- `hidden` attribute on inactive content


### Data Attributes for CSS
- `data-state="active"` or `"inactive"`
- `data-value` contains the trigger's value
