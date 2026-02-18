# ShadNG Separator

Visual separator for dividing content sections. Supports horizontal and vertical orientations with proper accessibility attributes.

## Installation

```bash
npx @shadng/sng-ui add separator
```

## Basic Usage

```html
<!-- Horizontal separator (default) -->
<sng-separator />

<!-- Vertical separator -->
<sng-separator orientation="vertical" class="h-6" />

<!-- With spacing -->
<sng-separator class="my-4" />
```

---

# SngSeparator Technical Reference

Complete reference for implementing the SngSeparator component. No CDK required - this is a pure presentational component.

## Component Architecture
```typescript
// projects/sng-ui/src/lib/separator/sng-separator.ts
// import { Component, input, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
// import { cn } from './cn';
//
// @Component({
//   selector: 'sng-separator',
//   standalone: true,
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   encapsulation: ViewEncapsulation.None,
//   host: {
//     'role': 'separator',
//     '[attr.aria-orientation]': 'orientation()',
//     '[class]': 'hostClasses()',
//   },
//   template: ``,
// })
// export class SngSeparator {
//   class = input<string>('');
//   orientation = input<'horizontal' | 'vertical'>('horizontal');
//
//   hostClasses = computed(() =>
//     cn(
//       'shrink-0 bg-border',
//       this.orientation() === 'vertical' ? 'h-full w-px' : 'block h-px w-full',
//       this.class()
//     )
//   );
// }
```

## API Reference
```typescript
// Input: class
// Type: string
// Default: ''
// Description: Custom CSS classes merged with defaults
//
// Input: orientation
// Type: 'horizontal' | 'vertical'
// Default: 'horizontal'
// Description: Direction of the separator line
```

## Horizontal Usage
```html
<div class="space-y-4">
  <div>Section 1 content</div>
  <sng-separator />
  <div>Section 2 content</div>
</div>
```

## Vertical Usage
```html
<!-- Parent needs defined height for vertical separators -->
<div class="flex h-5 items-center gap-4">
  <span>Item 1</span>
  <sng-separator orientation="vertical" />
  <span>Item 2</span>
  <sng-separator orientation="vertical" />
  <span>Item 3</span>
</div>
```

## Text Overlay Pattern
```html
<!-- Separator with centered text overlay -->
<div class="relative">
  <div class="absolute inset-0 flex items-center">
    <sng-separator class="w-full" />
  </div>
  <div class="relative flex justify-center">
    <span class="bg-background px-2 text-muted-foreground text-xs uppercase">
      Or continue with
    </span>
  </div>
</div>
```

## Styling Customization
```html
<!-- Custom color -->
<sng-separator class="bg-primary" />

<!-- Custom thickness -->
<sng-separator class="h-[2px]" />

<!-- With margins -->
<sng-separator class="my-6" />
```

## Do's and Don'ts
### Do
- Use horizontal separators between stacked content sections
- Use vertical separators for inline navigation/toolbar items
- Ensure parent has defined height for vertical separators
- Use semantic `role="separator"` (built-in)

### Don't
- Overuse separators - spacing alone often suffices
- Forget height constraint for vertical orientation
- Use separators for purely decorative borders (use CSS border instead)

## Common Mistakes
1. **Vertical separator not visible**: Parent container needs explicit height (e.g., `h-5`, `h-6`)
2. **Separator color wrong in dark mode**: Use theme token `bg-border` (default) not hardcoded colors
3. **Too many separators**: Creates visual noise - use spacing instead when possible

## Accessibility Summary
- Uses semantic `role="separator"`
- `aria-orientation` reflects current orientation
- Screen readers announce as content separator
- No focus interaction needed (decorative element)
