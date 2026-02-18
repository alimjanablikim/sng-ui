
# ShadNG Checkbox

Angular checkbox component with three states for forms and multi-select lists. Supports checked, unchecked, and indeterminate states with full form integration.

## Installation

```bash
npx @shadng/sng-ui add checkbox
```

## Basic Usage

```html
<!-- Basic checkbox with label -->
<div class="flex items-center space-x-2">
  <sng-checkbox id="terms" [(checked)]="accepted" />
  <sng-label for="terms">Accept terms and conditions</sng-label>
</div>

<!-- Indeterminate state -->
<sng-checkbox [indeterminate]="true" />

<!-- Programmatic control -->
<sng-checkbox [(checked)]="newsletter" />
```

---

# SngCheckbox Technical Reference

Complete reference for implementing the SngCheckbox component. Supports three states (checked, unchecked, indeterminate) with Signal API for two-way binding.

## Component Architecture
```typescript
// projects/sng-ui/src/lib/checkbox/sng-checkbox.ts
// Signal Forms compatible - NO ControlValueAccessor
@Component({
  selector: 'sng-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
    '(click)': 'toggle()',
    '[attr.role]': '"checkbox"',
    '[attr.aria-checked]': 'ariaChecked()',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '[attr.data-state]': 'dataState()',
  },
  template: `
    @if (indeterminate()) {
      <svg class="size-3.5 sng-animate-check-scale-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    } @else if (checked()) {
      <svg class="size-3.5 sng-animate-check-scale-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    }
  `,
})
export class SngCheckbox {
  class = input<string>('');
  checked = model(false);
  disabled = input(false, { transform: booleanAttribute });
  indeterminate = input(false, { transform: booleanAttribute });
}
```

## API Reference
```typescript
// Component Interface (Signal Forms compatible, no CVA)
interface SngCheckbox {
  // Custom CSS classes. Use Tailwind for sizing: size-4 (sm), size-5 (default), size-6 (lg)
  class: InputSignal<string>;                    // Default: ''

  // Whether the checkbox is checked (supports two-way binding)
  checked: ModelSignal<boolean>;                 // Default: false

  // Whether the checkbox is disabled
  disabled: InputSignal<boolean>;                // Default: false

  // Whether the checkbox is in indeterminate state (shows minus icon)
  indeterminate: InputSignal<boolean>;           // Default: false

  // Computed states (read-only)
  ariaChecked: Signal<boolean | 'mixed'>;        // true | false | 'mixed'
  dataState: Signal<'checked' | 'unchecked' | 'indeterminate'>;

  // Methods
  toggle(): void;                                // Toggle checked state
}
```

## Basic Usage with Label
```html
<div class="flex items-center space-x-2">
  <sng-checkbox id="terms" [(checked)]="accepted" />
  <sng-label for="terms">Accept terms and conditions</sng-label>
</div>
```

## With Description Text
```html
<div class="flex gap-2">
  <sng-checkbox id="terms-desc" />
  <div class="grid gap-1.5 leading-none">
    <sng-label for="terms-desc">Accept terms and conditions</sng-label>
    <p class="text-sm text-muted-foreground">
      You agree to our Terms of Service and Privacy Policy.
    </p>
  </div>
</div>
```

## Three States Pattern
```html
<!-- Unchecked (default) -->
<sng-checkbox id="unchecked" />

<!-- Checked -->
<sng-checkbox id="checked" [checked]="true" />

<!-- Indeterminate (for partial selections) -->
<sng-checkbox id="indeterminate" [indeterminate]="true" />
```

## Disabled States
```html
<!-- Disabled unchecked -->
<sng-checkbox id="disabled-off" [disabled]="true" />

<!-- Disabled checked -->
<sng-checkbox id="disabled-on" [disabled]="true" [checked]="true" />
```

## Form Integration
```typescript
// With two-way binding (Signal Forms compatible)
// @Component({
//   template: `
//     <sng-checkbox [(checked)]="newsletter" />
//     <p>Subscribed: {{ newsletter() }}</p>
//   `
// })
// export class FormComponent {
//   newsletter = signal(false);
// }
```

## Select All Pattern
```typescript
// Parent checkbox with computed indeterminate state
// @Component({
//   template: `
//     <sng-checkbox
//       [checked]="allSelected()"
//       [indeterminate]="someSelected()"
//       (click)="toggleAll()" />
//   `
// })
// export class SelectAllComponent {
//   items = signal([false, true, false]);
//   allSelected = computed(() => this.items().every(Boolean));
//   someSelected = computed(() => this.items().some(Boolean) && !this.allSelected());
// }
```

## Size Variants
```html
<!-- Small checkbox (16px) - use class for sizing -->
<sng-checkbox id="small" class="size-4" />

<!-- Default checkbox (20px) -->
<sng-checkbox id="default" />

<!-- Large checkbox (24px) -->
<sng-checkbox id="large" class="size-6" />
```

## Styling Customization
```html
<!-- Custom colors when checked -->
<sng-checkbox class="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" />

<!-- Override default size with class -->
<sng-checkbox class="size-8" />

<!-- Custom border -->
<sng-checkbox class="border-2 rounded-sm" />
```

## Do's and Don'ts
### Do
- Pair checkboxes with visible labels for accessibility
- Use indeterminate state for partial selections in hierarchical lists
- Wrap checkbox and label together for larger click area on mobile
- Use checked/unchecked for form data, indeterminate for UI state only

### Don't
- Use checkboxes for instant settings (use Switch instead)
- Forget to associate labels with checkbox id
- Rely on color alone to indicate state (checkmark icon provides visual feedback)
- Use indeterminate as a third form value (it's a UI state, not a data state)

## Common Mistakes
1. **Checkbox too small on mobile**: Wrap in larger clickable container with padding
2. **Label not clickable**: Ensure label's `for` attribute matches checkbox's `id`
3. **Indeterminate in forms**: Don't submit indeterminate as form value - resolve to checked/unchecked
4. **Missing form integration**: Use `[(checked)]` two-way binding for form state

## Accessibility Summary
- Uses semantic `role="checkbox"` attribute
- `aria-checked` supports true, false, and "mixed" (for indeterminate)
- `aria-disabled` reflects disabled state
- Focus follows browser-default navigation behavior
- Checkmark icon provides non-color visual feedback
- tabindex managed automatically (0 when enabled, -1 when disabled)
