# ShadNG Toggle

A two-state button that can be toggled on or off. Perfect for formatting controls, toolbar buttons, and feature toggles.

## Installation

```bash
npx @shadng/sng-ui add toggle
```

## Basic Usage

```html
<!-- Simple toggle with icon -->
<sng-toggle aria-label="Toggle bold">
  <svg><!-- bold icon --></svg>
</sng-toggle>

<!-- With two-way binding -->
<sng-toggle [(pressed)]="isBold" aria-label="Toggle bold">
  <svg><!-- bold icon --></svg>
</sng-toggle>
```

## Toggle Group

For mutually exclusive or multi-select toolbar options, use Toggle Group:

```html
<!-- Single selection (radio-like) -->
<sng-toggle-group type="single" defaultValue="center">
  <sng-toggle-group-item value="left">Left</sng-toggle-group-item>
  <sng-toggle-group-item value="center">Center</sng-toggle-group-item>
  <sng-toggle-group-item value="right">Right</sng-toggle-group-item>
</sng-toggle-group>

<!-- Multiple selection (checkbox-like) -->
<sng-toggle-group type="multiple">
  <sng-toggle-group-item value="bold">B</sng-toggle-group-item>
  <sng-toggle-group-item value="italic">I</sng-toggle-group-item>
  <sng-toggle-group-item value="underline">U</sng-toggle-group-item>
</sng-toggle-group>
```

---

# SngToggle Technical Reference

Complete reference for implementing the SngToggle component. No CDK required - uses native button behavior with ARIA attributes.

## Component Architecture
```typescript
// projects/sng-ui/src/lib/toggle/sng-toggle.ts
// Signal Forms compatible - NO ControlValueAccessor
@Component({
  selector: 'sng-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'role': 'button',
    '[attr.aria-pressed]': 'pressed()',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '[class]': 'hostClasses()',
    '[attr.data-state]': 'pressed() ? "on" : "off"',
    '(click)': 'toggle()',
  },
  template: `<ng-content />`,
})
export class SngToggle {
  /** Custom CSS classes. Use Tailwind for sizing. */
  class = input<string>('');

  /** Whether pressed/active. Supports two-way binding. */
  pressed = model(false);

  /** Whether disabled. */
  disabled = input(false, { transform: booleanAttribute });

  hostClasses = computed(() => cn(
    'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium',
    'h-9 px-2 min-w-9 border border-input bg-background shadow-sm',
    'data-[state=off]:hover:bg-accent data-[state=off]:hover:text-accent-foreground',
    'disabled:pointer-events-none disabled:opacity-50',
    'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary',
    'data-[state=on]:hover:bg-primary data-[state=on]:hover:text-primary-foreground',
    this.class()
  ));
}
```

## API Reference
```typescript
// Input: class
// Type: string
// Default: ''
// Description: Custom CSS classes merged with defaults
//
// Input/Output: pressed
// Type: boolean
// Default: false
// Description: Two-way bound pressed state via model()
//
// Input: disabled
// Type: boolean
// Default: false
// Description: Disables interaction when true
//
// Output: pressedChange
// Type: ModelSignal<boolean>
// Description: Emits when pressed state changes (from model())
```

## Basic Usage
```html
<!-- Icon-only toggle -->
<sng-toggle aria-label="Toggle bold">
  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
  </svg>
</sng-toggle>
```

## Ghost Variant
```html
<!-- Outline is the default style; apply these classes for ghost -->
<sng-toggle
  class="data-[state=off]:border-transparent data-[state=off]:shadow-none data-[state=off]:bg-transparent data-[state=off]:hover:bg-muted data-[state=off]:hover:text-muted-foreground"
  aria-label="Toggle italic">
  <svg><!-- icon --></svg>
</sng-toggle>
```

## Formatting Toolbar Pattern
```typescript
// Component with multiple toggles
// formatting = signal({ bold: false, italic: false, underline: false });
//
// toggleFormat(format: 'bold' | 'italic' | 'underline') {
//   this.formatting.update(f => ({ ...f, [format]: !f[format] }));
// }

// Template:
// <div class="flex items-center gap-1 rounded-md border border-border p-1">
//   <sng-toggle [pressed]="formatting().bold" (pressedChange)="toggleFormat('bold')" aria-label="Bold" class="h-8 w-8 p-0">
//     <svg><!-- bold icon --></svg>
//   </sng-toggle>
//   <sng-toggle [pressed]="formatting().italic" (pressedChange)="toggleFormat('italic')" aria-label="Italic" class="h-8 w-8 p-0">
//     <svg><!-- italic icon --></svg>
//   </sng-toggle>
// </div>
```

## Form Integration
```typescript
// Toggle uses model() for two-way binding (Signal Forms compatible)
// import { signal } from '@angular/core';
//
// isBold = signal(false);
//
// Template:
// <sng-toggle [(pressed)]="isBold" aria-label="Bold">
//   <svg><!-- icon --></svg>
// </sng-toggle>
```

## Size Recipes
```html
<!-- Small - compact toolbars -->
<sng-toggle class="h-8 px-2" aria-label="Bold">...</sng-toggle>

<!-- Default -->
<sng-toggle class="h-9 px-3" aria-label="Bold">...</sng-toggle>

<!-- Large - touch-friendly -->
<sng-toggle class="h-10 px-3" aria-label="Bold">...</sng-toggle>
```

## Do's and Don'ts
### Do
- Always provide aria-label for icon-only toggles
- Group related toggles visually with borders
- Use visual distinction between on/off states
- Use model() for two-way binding with [(pressed)]

### Don't
- Forget aria-label on icon-only toggles (screen readers need context)
- Use Toggle for settings that persist (use Switch instead)
- Mix Toggle and Switch in the same toolbar
- Use for mutually exclusive options (use Toggle Group instead)

## Common Mistakes
1. **No aria-label**: Icon-only toggles are invisible to screen readers. Always add `aria-label="Toggle bold"` or similar.
2. **Wrong component choice**: Toggle = toolbar actions (immediate), Switch = settings (persistent). Choose correctly.
3. **Forgetting disabled input**: Use the `[disabled]` input to prevent toggle interaction when needed.

## Accessibility Summary
- Uses `role="button"` with `aria-pressed` attribute
- `data-state="on"` or `data-state="off"` for CSS styling hooks
- Focus support follows native button behavior
- Focus visible ring for focus navigation
- Proper disabled state handling (tabindex=-1 when disabled)

---

# SngToggleGroup Technical Reference

Complete reference for implementing the SngToggleGroup component. Signal-based state management, no CDK required.

## Toggle Group API
```typescript
// SngToggleGroup Inputs
// type: 'single' | 'multiple' (default: 'single') - Selection mode
// defaultValue: string | string[] (default: '') - Initially selected value(s)
// class: string (default: '') - Custom CSS classes

// SngToggleGroupItem Inputs
// value: string (required) - Unique value for this item
// disabled: boolean (default: false) - Whether item is disabled
// class: string (default: '') - Custom CSS classes
```

## Toggle Group Usage
```html
<!-- Single selection - only one item can be selected -->
<sng-toggle-group type="single" defaultValue="center">
  <sng-toggle-group-item value="left">Left</sng-toggle-group-item>
  <sng-toggle-group-item value="center">Center</sng-toggle-group-item>
  <sng-toggle-group-item value="right">Right</sng-toggle-group-item>
</sng-toggle-group>

<!-- Multiple selection - multiple items can be selected -->
<sng-toggle-group type="multiple" [defaultValue]="['bold']">
  <sng-toggle-group-item value="bold">B</sng-toggle-group-item>
  <sng-toggle-group-item value="italic">I</sng-toggle-group-item>
</sng-toggle-group>
```

## Toggle Group Do's and Don'ts
### Do
- Use single selection for mutually exclusive options (text alignment)
- Use multiple selection for combinable options (bold + italic)
- Limit to 5 options maximum for scannability
- Set defaultValue when "nothing selected" is not valid

### Don't
- Use toggle groups for more than 5 options - use dropdown instead
- Use positional values like "item-1" - use semantic names like "left"
- Forget unique `value` attribute on each item
