# ShadNG Skeleton

Loading placeholder component with animated pulse effect. Prevents layout shift while content loads.

## Installation

```bash
npx @shadng/sng-ui add skeleton
```

## Basic Usage

```html
<!-- Basic text line -->
<sng-skeleton class="h-4 w-[250px]" />

<!-- Avatar placeholder -->
<sng-skeleton class="h-12 w-12 rounded-full" />

<!-- Image placeholder -->
<sng-skeleton class="h-[200px] w-full rounded-md" />

<!-- Full width bar -->
<sng-skeleton class="h-8 w-full" />
```

---

# SngSkeleton Technical Reference

Complete reference for implementing the SngSkeleton component. No CDK required - this is a pure presentational component.

## Component Architecture
```typescript
// projects/sng-ui/src/lib/skeleton/sng-skeleton.ts
// import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
// import { cn } from './cn';
//
// @Component({
//   selector: 'sng-skeleton',
//   standalone: true,
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   host: {
//     '[class]': 'hostClasses()',
//   },
//   template: ``,
// })
// export class SngSkeleton {
//   class = input<string>('');
//
//   hostClasses = computed(() =>
//     cn('bg-accent block animate-pulse rounded-md', this.class())
//   );
// }
```

## API Reference
```typescript
// Input: class
// Type: string
// Default: ''
// Description: Custom CSS classes to control size (h-*, w-*) and shape (rounded-*).
//   Shape customization via Tailwind:
//   - Default (rounded rectangle): no extra classes needed
//   - Circular (avatars): class="rounded-full h-12 w-12"
//   - Text line: class="rounded h-4 w-full"
```

## Profile Skeleton Pattern
```html
<!-- User profile with avatar and text lines -->
<div class="flex items-center space-x-4">
  <sng-skeleton class="h-12 w-12 rounded-full" />
  <div class="space-y-2">
    <sng-skeleton class="h-4 w-[250px]" />
    <sng-skeleton class="h-4 w-[200px]" />
  </div>
</div>
```

## Card Skeleton Pattern
```html
<!-- Card with image and content -->
<div class="flex flex-col space-y-3">
  <sng-skeleton class="h-[125px] w-[250px] rounded-xl" />
  <div class="space-y-2">
    <sng-skeleton class="h-4 w-[250px]" />
    <sng-skeleton class="h-4 w-[200px]" />
  </div>
</div>
```

## Shape Variations
```html
<!-- Text line -->
<sng-skeleton class="h-4 w-[200px]" />

<!-- Circle (avatars) -->
<sng-skeleton class="h-12 w-12 rounded-full" />

<!-- Rectangle (images, cards) -->
<sng-skeleton class="h-[200px] w-full rounded-md" />

<!-- Square (gallery thumbnails) -->
<sng-skeleton class="aspect-square rounded-md" />
```

## Conditional Rendering
```html
<!-- Show skeleton while loading, content when ready -->
@if (isLoading()) {
  <sng-skeleton class="h-4 w-[200px]" />
} @else {
  <p>{{ content() }}</p>
}
```

## Do's and Don'ts
### Do
- Match skeleton dimensions to actual content
- Use for content with predictable layout
- Keep animation subtle (default pulse is ideal)
- Test on slow connections with DevTools throttling

### Don't
- Use random skeleton shapes that don't match content
- Overuse in places where spinners work better
- Add extra animations on top of pulse
- Keep skeletons visible after content loads

## Common Mistakes
1. **Wrong dimensions**: Skeleton doesn't match content size, causing layout shift
2. **Overuse**: Using skeletons for everything instead of just predictable content
3. **Missing rounded-full**: Avatar placeholders look wrong without circle shape
4. **Static skeletons**: Removing animate-pulse makes it look broken

## Accessibility Summary
- Skeletons are purely visual loading indicators
- Add `aria-busy="true"` to container while loading
- Use `aria-live="polite"` to announce when content loads
- No focus interaction needed (decorative element)
