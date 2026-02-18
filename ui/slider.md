# ShadNG Slider

Angular range input component for selecting values within a range. Built with TypeScript and Tailwind CSS.

## Installation

```bash
npx @shadng/sng-ui add slider
```

## Basic Usage

```html
<!-- Basic slider with two-way binding -->
<sng-slider [(value)]="volume" />

<!-- Big slider -->
<sng-slider class="h-2.5 [--thumb-size:1.5rem]" [(value)]="volume" />

<!-- With custom range -->
<sng-slider [min]="0" [max]="100" [step]="5" [(value)]="brightness" />

<!-- Vertical orientation -->
<sng-slider orientation="vertical" class="h-[150px]" [(value)]="level" />

<!-- Disabled state -->
<sng-slider [value]="50" [disabled]="true" />
```

## Two-Way Binding

```html
<!-- With [(value)] two-way binding (Signal Forms compatible) -->
<sng-slider [(value)]="volume" />

<!-- With one-way binding and event -->
<sng-slider [value]="brightness()" (valueChange)="brightness.set($event)" />
```

---

# SngSlider Technical Reference

Complete reference for implementing the SngSlider component. Uses native range input with custom styling for maximum compatibility.

## Component Architecture
```typescript
// projects/sng-ui/src/lib/slider/sng-slider.ts
// Signal Forms compatible - NO ControlValueAccessor
@Component({
  selector: 'sng-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <input
      type="range"
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [value]="value()"
      [disabled]="disabled()"
      (input)="onInput($event)"
      [class]="inputClasses()"
    />
  `,
})
export class SngSlider {
  /** Custom CSS classes. */
  class = input<string>('');

  /** Slider orientation. */
  orientation = input<'horizontal' | 'vertical'>('horizontal');

  /** Minimum value. */
  min = input(0, { transform: numberAttribute });

  /** Maximum value. */
  max = input(100, { transform: numberAttribute });

  /** Step increment. */
  step = input(1, { transform: numberAttribute });

  /** Current value. Supports two-way binding. */
  value = model(0);

  /** Whether disabled. */
  disabled = input(false, { transform: booleanAttribute });
}
```

## API Reference
```typescript
// Input: class
// Type: string
// Default: ''
// Description: Custom CSS classes applied to the native range input. Use utilities for size and thumb customization.
//
// Input: orientation
// Type: 'horizontal' | 'vertical'
// Default: 'horizontal'
// Description: Slider track orientation
//
// Input: min
// Type: number
// Default: 0
// Description: Minimum value of the slider
//
// Input: max
// Type: number
// Default: 100
// Description: Maximum value of the slider
//
// Input: step
// Type: number
// Default: 1
// Description: Step increment between values
//
// Model: value
// Type: number
// Default: 0
// Description: Current slider value (supports two-way binding)
//
// Input: disabled
// Type: boolean
// Default: false
// Description: Whether the slider is disabled
```

## Basic Usage
```html
<sng-slider [(value)]="volume" />
<span>Volume: {{ volume() }}%</span>
```

## Range Values
```html
<!-- Temperature range: 0-40 with step of 1 -->
<sng-slider [min]="0" [max]="40" [step]="1" [(value)]="temperature" />

<!-- Volume: 0-10 with step of 0.5 -->
<sng-slider [min]="0" [max]="10" [step]="0.5" [(value)]="volume" />
```

## Vertical Orientation
```html
<!-- Parent needs defined height for vertical sliders -->
<div class="h-[200px] flex items-center justify-center">
  <sng-slider
    orientation="vertical"
    class="h-[150px]"
    [(value)]="level"
  />
</div>
```

## Form Integration
```typescript
// // Signal Forms compatible - use [(value)] two-way binding
// export class FormComponent {
//   volume = signal(50);
//   brightness = signal(75);
//   contrast = signal(100);
// }
```
```html
<!-- Two-way binding (Signal Forms compatible) -->
<sng-slider [(value)]="volume" />
<sng-slider [(value)]="brightness" />
```

## Styling
```html
<!-- Custom width -->
<sng-slider class="w-[300px]" [(value)]="val" />

<!-- Small slider -->
<sng-slider class="w-[300px] h-1 [--thumb-size:0.875rem]" [(value)]="val" />

<!-- Big slider -->
<sng-slider class="w-[300px] h-2.5 [--thumb-size:1.5rem]" [(value)]="val" />

<!-- Full width in container -->
<div class="w-full max-w-md">
  <sng-slider class="w-full" [(value)]="val" />
</div>
```

## Do's and Don'ts
### Do
- Always show the current value near the slider
- Use appropriate step values for the data type
- Provide explicit height for vertical sliders
- Use with Label component for form fields

### Don't
- Forget height on vertical sliders (they collapse)
- Use tiny step values for large ranges (performance)
- Ignore mobile touch targets (increase thumb size)
- Hardcode colors (use theme tokens)

## Common Mistakes
1. **Vertical slider not visible**: Must set explicit height class like `h-[150px]`
2. **Value not updating**: Use `[(value)]` for two-way binding or `(valueChange)` event
3. **Form not receiving updates**: Use `[(value)]` two-way binding or listen to `(valueChange)` event
4. **Thumb too small on mobile**: Increase thumb size with CSS custom properties

## Accessibility Summary
- Uses native `<input type="range">` for built-in focus support
- Dragging and click controls adjust value by step increment
- Larger step changes follow native range-input behavior
- Works with screen readers out of the box
- Disabled state communicated via HTML attribute
