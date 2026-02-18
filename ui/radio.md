# ShadNG Radio

Angular radio component for single-choice selections. Built with TypeScript and Tailwind CSS, featuring two-way binding with Signal Forms compatibility.

## Installation

```bash
npx @shadng/sng-ui add radio
```

## Basic Usage

```html
<!-- Simple radio with two-way binding -->
<sng-radio [(value)]="selectedOption">
  <div class="flex items-center gap-3">
    <sng-radio-item value="option1" />
    <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Option 1</label>
  </div>
  <div class="flex items-center gap-3">
    <sng-radio-item value="option2" />
    <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Option 2</label>
  </div>
</sng-radio>

<!-- Custom sizes via class -->
<sng-radio [(value)]="selected">
  <sng-radio-item value="a" class="size-4" />
  <sng-radio-item value="b" />
  <sng-radio-item value="c" class="size-6" />
</sng-radio>
```

---

# Technical Reference

Complete reference for implementing the SngRadio component. Signal-based state management with model() for Signal Forms compatibility.

## Component Architecture
```typescript
// projects/sng-ui/src/lib/radio/sng-radio.ts
@Component({
  selector: 'sng-radio',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': '"radiogroup"',
    '[attr.aria-disabled]': 'disabled()',
    '[class]': 'hostClasses()',
  },
  template: `<ng-content />`,
})
export class SngRadio {
  /** Custom CSS classes. @default '' */
  class = input<string>('');

  /** Selected value. Supports two-way binding. @default '' */
  value = model<string>('');

  /** Name attribute for native form submission. @default '' */
  name = input<string>('');

  /** Whether the group is disabled. @default false */
  disabled = input(false, { transform: booleanAttribute });

  hostClasses = computed(() => cn('grid gap-3', this.class()));

  /** Called by radio items when selected */
  _selectValue(value: string) {
    if (this.disabled()) return;
    this.value.set(value);
  }
}
```

## Radio Item Implementation
```typescript
// projects/sng-ui/src/lib/radio/sng-radio-item.ts
// import {
//   Component, computed, input, inject,
//   ChangeDetectionStrategy, ViewEncapsulation, booleanAttribute, forwardRef
// } from '@angular/core';
// import { SngRadio } from './sng-radio';
// import { cn } from './cn';
//
// @Component({
//   selector: 'sng-radio-item',
//   standalone: true,
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   encapsulation: ViewEncapsulation.None,
//   host: {
//     '[class]': 'hostClasses()',
//     '(click)': 'select()',
//     '[attr.role]': '"radio"',
//     '[attr.aria-checked]': 'isChecked()',
//     '[attr.aria-disabled]': 'isDisabled()',
//     '[attr.tabindex]': 'isDisabled() ? -1 : 0',
//     '[attr.data-state]': 'isChecked() ? "checked" : "unchecked"',
//   },
//   template: `
//     @if (isChecked()) {
//       <svg class="fill-primary size-1/2" viewBox="0 0 24 24">
//         <circle cx="12" cy="12" r="12"/>
//       </svg>
//     }
//   `,
// })
// export class SngRadioItem {
//   private group = inject(forwardRef(() => SngRadio), { optional: true });
//
//   class = input<string>('');
//   value = input.required<string>();
//   disabled = input(false, { transform: booleanAttribute });
//
//   isDisabled = computed(() => this.disabled() || (this.group?.disabled() ?? false));
//   isChecked = computed(() => this.group?.value() === this.value());
//
//   hostClasses = computed(() =>
//     cn(
//       'aspect-square size-4 shrink-0 rounded-full border shadow-xs',
//       'cursor-pointer flex items-center justify-center text-primary',
//       'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
//       'border-input dark:bg-input/30',
//       this.class()
//     )
//   );
//
//   select() {
//     if (this.isDisabled()) return;
//     this.group?._selectValue(this.value());
//   }
// }
```

## Two-Way Binding
```typescript
// Using [(value)] for Signal Forms compatible two-way binding
// import { Component, signal } from '@angular/core';
// import { SngRadio, SngRadioItem } from 'sng-ui';
//
// @Component({
//   selector: 'app-form-example',
//   standalone: true,
//   imports: [SngRadio, SngRadioItem],
//   template: `
//     <sng-radio [(value)]="selectedPlan" class="flex flex-col gap-3">
//       <div class="flex items-center gap-3">
//         <sng-radio-item value="free" />
//         <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Free Plan</label>
//       </div>
//       <div class="flex items-center gap-3">
//         <sng-radio-item value="pro" />
//         <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Pro Plan</label>
//       </div>
//     </sng-radio>
//     <p>Selected: {{ selectedPlan() }}</p>
//   `
// })
// export class FormExampleComponent {
//   selectedPlan = signal('free');
// }
```

## Custom Sizes
```html
<!-- The dot uses size-1/2 so it scales automatically with the circle -->
<!-- Small radio -->
<sng-radio-item value="a" class="size-3" />

<!-- Default (size-4 built-in) -->
<sng-radio-item value="b" />

<!-- Large radio -->
<sng-radio-item value="c" class="size-5" />
```

## Disabled States
```html
<!-- Disable entire group -->
<sng-radio [disabled]="true" [(value)]="option">
  <sng-radio-item value="a" />
  <sng-radio-item value="b" />
</sng-radio>

<!-- Disable individual items -->
<sng-radio [(value)]="option">
  <sng-radio-item value="available" />
  <sng-radio-item value="disabled" [disabled]="true" />
  <sng-radio-item value="another" />
</sng-radio>
```

## Do's and Don'ts
### Do
- Use radio groups for 2-5 mutually exclusive options
- Always pair radio items with visible labels using native `<label>` elements
- Pre-select a sensible default when one option is clearly common
- Use `class="size-3"` or `class="size-5"` to adjust radio button size
- Use `[(value)]` for two-way binding with Signal Forms

### Don't
- Use radio groups for more than 5 options (use Select instead)
- Leave radio groups without a default selection unless truly necessary
- Forget to add labels - radio buttons alone are small click targets
- Mix radio groups and checkboxes for the same selection type
- Use for yes/no toggles (use Switch or Checkbox instead)

## Common Mistakes
1. **No parent group**: Radio items must be inside sng-radio to function
2. **Missing value attribute**: Each sng-radio-item requires a unique value
3. **Labels not clickable**: `sng-radio-item` is a custom element, so plain sibling label text is not automatically interactive. Keep copy and spacing close to the control or wire row clicks explicitly.
4. **Wrong component choice**: For 6+ options, use Select; for boolean, use Switch

## Accessibility Summary
- Uses semantic `role="radiogroup"` on container
- Each item has `role="radio"` with `aria-checked` state
- `aria-disabled` reflects disabled state
- Uses browser-default tab focus with click/touch-driven selection
- Focus moves in and out of the group with browser-default behavior
