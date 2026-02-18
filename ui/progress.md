# ShadNG Progress

Progress bar for displaying completion status. Shows users that operations are actually happening instead of leaving them in the dark. Supports horizontal and vertical orientations.

## Installation

```bash
npx @shadng/sng-ui add progress
```

## Basic Usage

```html
<!-- Basic progress bar -->
<sng-progress [value]="33" />

<!-- Full width with custom height -->
<sng-progress [value]="66" class="h-4 w-full" />

<!-- Vertical progress bar -->
<sng-progress [value]="50" orientation="vertical" class="h-48" />
```

---

# Technical Reference

Complete reference for implementing the SngProgress component. No CDK required - this is a pure presentational component with CSS transforms. Supports horizontal and vertical orientations.

## Component Architecture
```typescript
// projects/sng-ui/src/lib/progress/sng-progress.ts
// import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, computed } from '@angular/core';
// import { cn } from './cn';
//
// @Component({
//   selector: 'sng-progress',
//   standalone: true,
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   encapsulation: ViewEncapsulation.None,
//   host: {
//     'role': 'progressbar',
//     '[attr.aria-valuemin]': '0',
//     '[attr.aria-valuemax]': '100',
//     '[attr.aria-valuenow]': 'clampedValue()',
//     '[attr.aria-orientation]': 'orientation()',
//     '[class]': 'hostClasses()',
//   },
//   template: `
//     <div
//       [class]="indicatorClasses()"
//       [style.transform]="indicatorTransform()">
//     </div>
//   `,
// })
// export class SngProgress {
//   class = input<string>('');
//   value = input<number>(0);
//   orientation = input<'horizontal' | 'vertical'>('horizontal');
//
//   hostClasses = computed(() =>
//     cn(
//       'relative block overflow-hidden rounded-full bg-current/20 text-primary',
//       this.orientation() === 'vertical' ? 'w-2 h-full' : 'h-2 w-full',
//       this.class()
//     )
//   );
//
//   indicatorClasses = computed(() =>
//     cn('h-full w-full flex-1 bg-current transition-transform')
//   );
//
//   clampedValue = computed(() => Math.max(0, Math.min(100, this.value())));
//
//   indicatorTransform = computed(() => {
//     const remaining = 100 - this.clampedValue();
//     return this.orientation() === 'vertical'
//       ? `translateY(${remaining}%)`
//       : `translateX(-${remaining}%)`;
//   });
// }
```

## API Reference
```typescript
// Input: value
// Type: number
// Default: 0
// Description: Current progress value. Values are clamped to 0-100.

// Input: orientation
// Type: 'horizontal' | 'vertical'
// Default: 'horizontal'
// Description: Orientation of the progress bar. Vertical requires explicit height via class.

// Input: class
// Type: string
// Default: ''
// Description: Custom CSS classes merged with defaults.
//   Customize colors via Tailwind:
//   - Success: class="text-green-500"
//   - Warning: class="text-yellow-500"
//   - Error:   class="text-destructive"
```

## Basic Usage
```html
<!-- Simple progress bar -->
<sng-progress [value]="33" />

<!-- With dynamic value -->
<sng-progress [value]="uploadProgress()" />
```

## Vertical Orientation
```html
<!-- Vertical progress bars need explicit height -->
<sng-progress [value]="75" orientation="vertical" class="h-48" />

<!-- Multiple vertical bars with labels -->
<div class="flex items-end gap-8">
  <div class="flex flex-col items-center gap-2">
    <sng-progress [value]="25" orientation="vertical" class="h-48" />
    <span class="text-xs text-muted-foreground">25%</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <sng-progress [value]="75" orientation="vertical" class="h-48" />
    <span class="text-xs text-muted-foreground">75%</span>
  </div>
</div>
```

## Progress with Label
```html
<!-- Show percentage alongside the bar -->
<div class="space-y-2">
  <div class="flex justify-between text-sm">
    <span class="text-muted-foreground">Uploading...</span>
    <span class="text-foreground font-medium">{{ progress() }}%</span>
  </div>
  <sng-progress [value]="progress()" />
</div>
```

## Different Sizes
```html
<!-- Small progress bar -->
<sng-progress [value]="60" class="h-1" />

<!-- Default height -->
<sng-progress [value]="60" />

<!-- Large progress bar -->
<sng-progress [value]="60" class="h-4" />
```

## Custom Colors
```html
<!-- Primary color (default) -->
<sng-progress [value]="50" />

<!-- Custom indicator color via CSS variable override -->
<sng-progress [value]="50" class="text-green-500" />

<!-- Custom track color -->
<sng-progress [value]="50" class="bg-muted" />
```

## Animated Progress Demo
```typescript
// import { Component, signal, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import { SngProgress } from 'sng-ui';
//
// @Component({
//   selector: 'app-animated-progress',
//   standalone: true,
//   imports: [SngProgress],
//   template: `
//     <div class="w-full max-w-md space-y-4">
//       <div class="flex justify-between text-sm">
//         <span class="text-muted-foreground">Uploading...</span>
//         <span class="text-foreground font-medium">{{ progressValue() }}%</span>
//       </div>
//       <sng-progress [value]="progressValue()" />
//     </div>
//   `
// })
// export class AnimatedProgressComponent implements OnInit, OnDestroy {
//   private platformId = inject(PLATFORM_ID);
//   progressValue = signal(0);
//   private interval: ReturnType<typeof setInterval> | null = null;
//
//   ngOnInit() {
//     if (isPlatformBrowser(this.platformId)) {
//       this.interval = setInterval(() => {
//         this.progressValue.update(v => v >= 100 ? 0 : v + 5);
//       }, 500);
//     }
//   }
//
//   ngOnDestroy() {
//     if (this.interval) clearInterval(this.interval);
//   }
// }
```

## Do's and Don'ts
### Do
- Use progress bars when you know how far along an operation is
- Start progress immediately (show 1%) so users know something started
- Show context labels like "Uploading photo..." alongside the bar
- Handle errors gracefully with clear messaging and retry options
- Use vertical orientation for volume meters, skill bars, or dashboard gauges

### Don't
- Use progress for quick operations (use spinners instead)
- Let progress freeze at 90%-use indeterminate state if unpredictable
- Leave users staring at a bar without context of what's happening
- Forget to reset progress to 0 when starting a new operation
- Use vertical without providing an explicit height class

## Common Mistakes
1. **Progress not animating**: The component uses CSS `transition-transform` - ensure value changes are detected
2. **Bar overflows container**: Parent needs `overflow-hidden` (built into component by default)
3. **Wrong height**: Use `class="h-1"` for smaller or `class="h-4"` for larger bars
4. **Progress jumping erratically**: Smooth incremental updates feel faster than random jumps
5. **Vertical bar invisible**: Vertical orientation uses `h-full` - provide a fixed height like `class="h-48"`

## Accessibility Summary
- Uses semantic `role="progressbar"`
- `aria-valuemin="0"` and `aria-valuemax="100"` set bounds
- `aria-valuenow` reflects current progress value
- `aria-orientation` reflects horizontal or vertical
- Screen readers announce progress changes
- For important updates, consider adding aria-live regions with descriptive text
