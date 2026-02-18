# ShadNG Switch

Toggle switch component for binary on/off states. Uses model() for two-way binding, compatible with Signal Forms.

## Installation

```bash
npx @shadng/sng-ui add switch
```

## Basic Usage

```html
<!-- Basic switch with label -->
<sng-switch [ariaLabelledby]="'airplane-mode-label'" />
<span id="airplane-mode-label">Airplane Mode</span>

<!-- Two-way binding -->
<sng-switch [(checked)]="darkMode" />

<!-- Programmatic control -->
<sng-switch [(checked)]="notifications" />
```

---

# SngSwitch Technical Reference

Complete reference for implementing the SngSwitch component. No CDK required - uses Signal API with model() for two-way binding.

## Component Architecture
```typescript
// projects/sng-ui/src/lib/switch/sng-switch.ts
// import {
//   Component,
//   model,
//   input,
//   ChangeDetectionStrategy,
//   booleanAttribute,
//   computed,
// } from '@angular/core';
// import { cn } from './cn';
//
// Signal Forms compatible - NO ControlValueAccessor
@Component({
  selector: 'sng-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '(click)': 'toggle()',
    '[attr.role]': '"switch"',
    '[attr.aria-checked]': 'checked()',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.aria-labelledby]': 'ariaLabelledby() || null',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '[attr.data-state]': 'checked() ? "checked" : "unchecked"',
  },
  template: `<span [class]="thumbClasses()"></span>`,
})
export class SngSwitch {
  /** Custom CSS classes. Use Tailwind for sizing: h-4 w-7 (sm), h-5 w-9 (default). */
  class = input<string>('');

  /** Whether checked/on. Supports two-way binding. */
  checked = model(false);

  /** Whether disabled. */
  disabled = input(false, { transform: booleanAttribute });

  /** Accessible label text when no visible label is associated. */
  ariaLabel = input<string>('');

  /** Element id reference for visible accessible label text. */
  ariaLabelledby = input<string>('');

  hostClasses = computed(() =>
    cn(
      'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full',
      'border-2 border-transparent shadow-xs transition-colors outline-none',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      'aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
      'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
      this.class()
    )
  );

  toggle() {
    if (this.disabled()) return;
    this.checked.set(!this.checked());
  }
}
```

## API Reference
```typescript
// Input: class
// Type: string
// Default: ''
// Description: Custom CSS classes merged with defaults
//
// Input: checked
// Type: boolean
// Default: false
// Description: Two-way bindable checked state using model()
//
// Input: ariaLabel
// Type: string
// Default: ''
// Description: Accessible label text when no visible label is associated
//
// Input: ariaLabelledby
// Type: string
// Default: ''
// Description: Element id reference for visible accessible label text
//
// Input: disabled
// Type: boolean
// Default: false
// Description: Prevents toggle interaction
//
// Output: checkedChange
// Type: ModelSignal<boolean>
// Description: Emits when checked state changes (automatic with model())
```

## Basic Usage with Visible Label
```html
<div class="flex items-center gap-2">
  <sng-switch [ariaLabelledby]="'airplane-mode-label'" />
  <span id="airplane-mode-label">Airplane Mode</span>
</div>
```

## Two-Way Binding
```typescript
// @Component({
//   template: `
//     <sng-switch [(checked)]="darkMode" />
//     <p>Dark mode is: {{ darkMode ? 'ON' : 'OFF' }}</p>
//   `
// })
// export class ToggleExample {
//   darkMode = signal(false);
// }
```

## Two-Way Binding
```typescript
// @Component({
//   template: `
//     <sng-switch [(checked)]="notifications" />
//     <p>Notifications: {{ notifications() ? 'ON' : 'OFF' }}</p>
//
//     <sng-switch [(checked)]="marketing" />
//     <p>Marketing: {{ marketing() ? 'ON' : 'OFF' }}</p>
//   `
// })
// export class FormExample {
//   notifications = signal(true);
//   marketing = signal(false);
// }
```

## Settings Panel Pattern
```html
<div class="w-full max-w-md rounded-lg border p-4">
  <div class="flex items-center justify-between py-4 border-b">
    <div class="flex flex-col gap-1">
      <span class="text-sm font-medium">Push Notifications</span>
      <span class="text-xs text-muted-foreground">Get notified about updates</span>
    </div>
    <sng-switch [checked]="notifications()" [ariaLabel]="'Push Notifications'" (checkedChange)="notifications.set($event)" />
  </div>
</div>
```

## Disabled States
```html
<!-- Disabled off -->
<sng-switch disabled />

<!-- Disabled on -->
<sng-switch disabled [checked]="true" />

<!-- Dynamically disabled -->
<sng-switch [disabled]="isLoading()" />
```

## Styling Customization
```html
<!-- Custom colors when checked -->
<sng-switch class="data-[state=checked]:bg-green-500" />

<!-- Small -->
<sng-switch class="h-4 w-7" />

<!-- Default (built-in) -->
<sng-switch />

<!-- Large -->
<sng-switch class="h-6 w-11" />
```

## Do's and Don'ts
### Do
- Use switches for instant settings (dark mode, notifications, features)
- Provide accessible names with `ariaLabel` or `ariaLabelledby`
- Show immediate visual feedback on toggle
- Persist switch state across sessions
- Group related switches together

### Don't
- Use switch for form fields that submit together (use checkbox instead)
- Omit accessible naming on unlabeled switches
- Use switch for multi-select scenarios
- Mix switches and checkboxes in the same context

## Common Mistakes
1. **Using switch instead of checkbox in forms**: Switches communicate instant action; checkboxes communicate "will be saved on submit"
2. **Missing accessible name**: Always provide `ariaLabel` or `ariaLabelledby`
3. **Not handling loading states**: Disable switch during save operations
4. **Forgetting to persist**: Users expect settings to survive page refresh

## Accessibility Summary
- Uses semantic `role="switch"`
- `aria-checked` reflects current state
- `aria-disabled` when disabled
- `aria-label` / `aria-labelledby` provide accessible naming
- Toggle action is click-driven
- Focus works in normal document flow
- Focus fully navigable
